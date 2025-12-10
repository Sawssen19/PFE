import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Service d'IA avec Google Gemini pour générer et améliorer des histoires de cagnottes
 */
export class GeminiService {
  private client: GoogleGenAI | null = null;
  private initialized: boolean = false;

  /**
   * Initialise le service Gemini (lazy initialization)
   */
  private initialize() {
    if (this.initialized) {
      console.log("✅ Service Gemini AI déjà initialisé");
      return;
    }

    console.log("🔧 Initialisation du service Gemini AI...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("❌ GEMINI_API_KEY manquante ou invalide");
      throw new Error(
        "GEMINI_API_KEY est requise. Vérifiez votre fichier .env"
      );
    }

    console.log(
      "   Clé API trouvée, premiers chars:",
      apiKey.substring(0, 10) + "..."
    );

    this.client = new GoogleGenAI({ apiKey });
    this.initialized = true;
    console.log("✅ Service Gemini AI initialisé (API v2)");
  }

  /**
   * Génère une histoire convaincante pour une cagnotte
   */
  async generateStory(title: string, category?: string): Promise<string> {
    this.initialize();

    if (!this.client) throw new Error("Service Gemini AI non initialisé");

    const prompt = this.buildPrompt(title, category);
    const modelName = "gemini-2.5-flash";

    try {
      console.log(`🤖 Envoi à Gemini avec le modèle: ${modelName}`);

      const response: GenerateContentResponse | undefined =
        await this.client.models.generateContent({
          model: modelName,
          contents: prompt,
        });

      const text = response?.text ?? "";

      if (!text) throw new Error("Réponse vide de l'API Gemini");

      console.log(`✅ Histoire générée, longueur: ${text.length} caractères`);

      return text.trim();
    } catch (error: any) {
      console.error("❌ Erreur lors de la génération avec Gemini:", error);
      throw new Error(`Impossible de générer l'histoire: ${error.message}`);
    }
  }

  /**
   * Améliore une histoire existante selon un feedback
   */
  async improveStory(currentStory: string, feedback: string): Promise<string> {
    this.initialize();

    if (!this.client) throw new Error("Service Gemini AI non initialisé");

    const prompt = `Améliore ce texte selon les consignes.

Texte actuel :
"${currentStory}"

Améliorations souhaitées :
${feedback}

Rappels :
- Reste naturel
- Ne change pas l'esprit de l'histoire
- Écris uniquement la nouvelle version`;

    try {
      const response: GenerateContentResponse | undefined =
        await this.client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      const text = response?.text ?? "";

      if (!text) throw new Error("Réponse vide de l'API Gemini");

      return text.trim();
    } catch (error: any) {
      console.error("❌ Erreur lors de l'amélioration avec Gemini:", error);
      throw new Error(`Impossible d'améliorer l'histoire: ${error.message}`);
    }
  }

  /**
   * Construit un prompt optimisé
   */
  private buildPrompt(title: string, category?: string): string {
    const categoryContext = category
      ? `Cette collecte appartient à la catégorie : ${category}.`
      : "";

    return `Tu es un assistant spécialisé dans l'écriture d'histoires convaincantes pour des collectes de fonds.

Titre de la cagnotte : "${title}"
${categoryContext}

Ta mission : Rédiger une histoire touchante et authentique (150 à 300 mots).
- Ton humain et sincère
- Émotionnel mais pas dramatique
- Première personne (je/nous)
- Pas de montant d'argent
- Terminer par des remerciements

Génère UNIQUEMENT le texte, sans titre.`;
  }
}

// Export d'une instance singleton
export const geminiService = new GeminiService();
