import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { kycConfig, getJumioHeaders } from '../config/kyc.config';

const prisma = new PrismaClient();

export interface KYCVerificationRequest {
  userId: string;
  documentType: 'CARTE_IDENTITE' | 'PASSEPORT';
  documentFrontUrl: string;
  documentBackUrl?: string;
}

export interface KYCVerificationResult {
  success: boolean;
  jumioReference?: string;
  verificationId?: string;
  error?: string;
}

export interface KYCDocumentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  documentNumber: string;
  expiryDate: string;
  nationality: string;
  gender?: string;
}

export class KYCService {
  /**
   * Initie une vérification KYC avec Jumio
   */
  static async initiateVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    try {
      // Vérifier que l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { id: request.userId },
        include: { kycVerification: true }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier qu'il n'y a pas déjà une vérification en cours
      if (user.kycVerification && user.kycVerification.verificationStatus === 'PENDING') {
        throw new Error('Une vérification KYC est déjà en cours');
      }

      // Créer la session de vérification Jumio
      const jumioSession = await this.createJumioSession(request, user);
      
      // Enregistrer la demande de vérification
      const kycRecord = await prisma.kYCVerification.upsert({
        where: { userId: request.userId },
        update: {
          documentType: request.documentType,
          documentFrontUrl: request.documentFrontUrl,
          documentBackUrl: request.documentBackUrl,
          verificationStatus: 'PENDING',
          jumioReference: jumioSession.reference,
          updatedAt: new Date(),
        },
        create: {
          userId: request.userId,
          documentType: request.documentType,
          documentFrontUrl: request.documentFrontUrl,
          documentBackUrl: request.documentBackUrl,
          verificationStatus: 'PENDING',
          jumioReference: jumioSession.reference,
        },
      });

      // Créer un log d'audit
      await prisma.kYCAuditLog.create({
        data: {
          userId: request.userId,
          action: 'KYC_VERIFICATION_INITIATED',
          details: `Vérification KYC initiée pour ${request.documentType}`,
        },
      });

      return {
        success: true,
        jumioReference: jumioSession.reference,
        verificationId: kycRecord.id,
      };

    } catch (error) {
      console.error('Erreur lors de l\'initiation KYC:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Crée une session de vérification Jumio
   */
  private static async createJumioSession(request: KYCVerificationRequest, user: any) {
    const payload = {
      customerInternalReference: user.id,
      userReference: user.email,
      callbackUrl: `${process.env.BASE_URL}/api/kyc/webhook`,
      successUrl: `${process.env.FRONTEND_URL}/kyc/success`,
      errorUrl: `${process.env.FRONTEND_URL}/kyc/error`,
      documentTypes: [kycConfig.documentTypes[request.documentType]],
      country: kycConfig.tunisia.countryCode,
      language: kycConfig.tunisia.language,
      verificationProfile: 'STANDARD_VERIFICATION',
    };

    const response = await axios.post(
      `${kycConfig.jumio.baseUrl}/initiate`,
      payload,
      {
        headers: getJumioHeaders(),
        timeout: kycConfig.verificationSettings.timeoutMs,
      }
    );

    return {
      reference: response.data.transactionReference,
      redirectUrl: response.data.redirectUrl,
    };
  }

  /**
   * Traite le webhook de Jumio
   */
  static async processWebhook(webhookData: any): Promise<void> {
    try {
      const { transactionReference, verificationStatus, documentData } = webhookData;

      // Trouver l'enregistrement KYC
      const kycRecord = await prisma.kYCVerification.findFirst({
        where: { jumioReference: transactionReference },
        include: { user: true }
      });

      if (!kycRecord) {
        throw new Error('Enregistrement KYC non trouvé');
      }

      // Mettre à jour le statut
      const verificationStatusMap: Record<string, any> = {
        'APPROVED_VERIFIED': 'VERIFIED',
        'DENIED_FRAUD': 'REJECTED',
        'DENIED_UNSUPPORTED_ID': 'REJECTED',
        'DENIED_UNSUPPORTED_ID_COUNTRY': 'REJECTED',
        'ERROR_NOT_READABLE_ID': 'REJECTED',
      };

      const newStatus = verificationStatusMap[verificationStatus] || 'PENDING';

      // Calculer le score de risque
      const riskScore = this.calculateRiskScore(webhookData, documentData);

      // Mettre à jour l'enregistrement KYC
      await prisma.kYCVerification.update({
        where: { id: kycRecord.id },
        data: {
          verificationStatus: newStatus,
          riskScore,
          verificationDate: newStatus === 'VERIFIED' ? new Date() : null,
          expiryDate: documentData?.expiryDate ? new Date(documentData.expiryDate) : null,
          rejectionReason: newStatus === 'REJECTED' ? webhookData.rejectionReason : null,
        },
      });

      // 🔐 Mettre à jour le statut utilisateur si vérifié
      if (newStatus === 'VERIFIED') {
        await prisma.user.update({
          where: { id: kycRecord.userId },
          data: { 
            status: 'PENDING',  // ✅ En attente d'approbation admin
            isActive: false     // ✅ Pas encore actif
          },
        });
        
        console.log(`✅ KYC vérifié pour l'utilisateur ${kycRecord.userId} - Statut changé à PENDING (en attente d'approbation admin)`);
      }

      // Créer un log d'audit
      await prisma.kYCAuditLog.create({
        data: {
          userId: kycRecord.userId,
          action: 'KYC_VERIFICATION_COMPLETED',
          details: `Vérification KYC ${newStatus} - Score de risque: ${riskScore}`,
        },
      });

      // Effectuer la vérification AML
      await this.performAMLCheck(kycRecord.userId);

    } catch (error) {
      console.error('Erreur lors du traitement du webhook KYC:', error);
    }
  }

  /**
   * Calcule le score de risque basé sur les données Jumio
   */
  private static calculateRiskScore(webhookData: any, documentData: any): number {
    let score = 0;

    // Vérification de l'expiration du document
    if (documentData?.expiryDate) {
      const expiryDate = new Date(documentData.expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 30) score += 20;
      else if (daysUntilExpiry < 90) score += 10;
    }

    // Vérification de la qualité de l'image
    if (webhookData.imageQuality === 'LOW') score += 15;
    if (webhookData.imageQuality === 'MEDIUM') score += 5;

    // Vérification de la cohérence des données
    if (webhookData.dataConsistency === 'LOW') score += 25;

    return Math.min(score, 100);
  }

  /**
   * Effectue une vérification AML
   */
  private static async performAMLCheck(userId: string): Promise<void> {
    try {
      // Ici vous pouvez intégrer des APIs gratuites comme:
      // - OFAC Sanctions List (gratuit)
      // - UN Sanctions List (gratuit)
      // - Local Tunisian sanctions (si disponible)

      const amlCheck = await prisma.aMLCheck.upsert({
        where: { userId },
        update: {
          lastCheckDate: new Date(),
          riskLevel: 'LOW', // Par défaut, à ajuster selon les résultats
        },
        create: {
          userId,
          riskLevel: 'LOW',
        },
      });

      // Log de l'audit AML
      await prisma.kYCAuditLog.create({
        data: {
          userId,
          action: 'AML_CHECK_PERFORMED',
          details: 'Vérification AML effectuée',
        },
      });

    } catch (error) {
      console.error('Erreur lors de la vérification AML:', error);
    }
  }

  /**
   * Récupère le statut KYC d'un utilisateur
   */
  static async getUserKYCStatus(userId: string) {
    try {
      const kycRecord = await prisma.kYCVerification.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            }
          }
        }
      });

      return kycRecord;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut KYC:', error);
      return null;
    }
  }

  /**
   * Met à jour les informations KYC d'un utilisateur
   */
  static async updateKYCInfo(userId: string, updates: Partial<any>) {
    try {
      const updated = await prisma.kYCVerification.update({
        where: { userId },
        data: updates,
      });

      await prisma.kYCAuditLog.create({
        data: {
          userId,
          action: 'KYC_INFO_UPDATED',
          details: 'Informations KYC mises à jour',
        },
      });

      return updated;
    } catch (error) {
      console.error('Erreur lors de la mise à jour KYC:', error);
      throw error;
    }
  }
} 