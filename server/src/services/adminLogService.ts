import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAdminLogParams {
  adminId: string;
  action: string;
  category: 'ADMIN' | 'USER' | 'CAGNOTTE' | 'REPORT' | 'SYSTEM' | 'AUTH';
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURITY' | 'DEBUG';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Service pour enregistrer les logs d'actions administratives
 */
export class AdminLogService {
  /**
   * Créer un log d'action admin
   */
  static async createLog(params: CreateAdminLogParams): Promise<void> {
    try {
      await prisma.adminLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          category: params.category,
          level: params.level,
          severity: params.severity,
          description: params.description,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata || {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
      console.log(`📋 Log admin créé: ${params.action} - ${params.description}`);
    } catch (error) {
      console.error('❌ Erreur lors de la création du log admin:', error);
      // Ne pas bloquer l'action si l'enregistrement du log échoue
    }
  }

  /**
   * Créer un log depuis une requête Express
   */
  static async createLogFromRequest(
    req: any,
    params: Omit<CreateAdminLogParams, 'adminId' | 'ipAddress' | 'userAgent'>
  ): Promise<void> {
    const adminId = req.user?.id;
    if (!adminId) {
      console.warn('⚠️ Tentative de création de log sans adminId');
      return;
    }

    await this.createLog({
      ...params,
      adminId,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  }
}

