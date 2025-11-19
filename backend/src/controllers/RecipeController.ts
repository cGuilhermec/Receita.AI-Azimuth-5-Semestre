// controllers/RecipeController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { IaReceitaModel } from "../model/IaReceitaModel";
import { IaReceitaService } from "../services/IaReceitaService"; // Importe a service

export class RecipeController {
  private iaReceitaModel: IaReceitaModel;
  private iaReceitaService: IaReceitaService;

  constructor() {
    this.iaReceitaModel = new IaReceitaModel();
    this.iaReceitaService = new IaReceitaService(); // Inicialize a service
  }

  // Buscar todas as receitas do usuário (apenas as que são receitas)
  async getUserRecipes(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.id;
      console.log("📋 Buscando receitas para usuário:", userId);

      // Use a service para buscar as receitas (ela já filtra isReceita: true)
      const receitas = await this.iaReceitaService.buscarReceitasPorUsuario(
        userId
      );

      res.json(receitas);
    } catch (error: any) {
      console.error("Erro ao buscar receitas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Salvar uma receita manualmente (se necessário)
  async saveRecipe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.id;
      const {
        chatId,
        title,
        description,
        image,
        prepTime,
        difficulty,
        cuisine,
        servings,
        ingredients,
        instructions,
      } = req.body;

      const receitaData = {
        userId,
        nomeUsuario: req.user.name || "Usuário",
        pergunta: `Receita salva: ${title}`,
        resposta: {
          titulo: title,
          ingredientes: ingredients,
          modo_preparo: Array.isArray(instructions)
            ? instructions.join("\n")
            : instructions,
        },
        isReceita: true,
        titulo: title,
        ingredientes: ingredients,
        modo_preparo: Array.isArray(instructions)
          ? instructions.join("\n")
          : instructions,
        data: new Date(),
      };

      const receitaSalva = await this.iaReceitaModel.createIaReceita(
        receitaData
      );
      res.json(receitaSalva);
    } catch (error: any) {
      console.error("Erro ao salvar receita:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Deletar uma receita
  async deleteRecipe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.id;
      const recipeId = req.params.id;

      // Verifica se a receita pertence ao usuário
      const receita = await this.iaReceitaModel.findById(recipeId);
      if (!receita || receita.userId !== userId) {
        return res.status(404).json({ error: "Receita não encontrada" });
      }

      // Use a service para deletar
      await this.iaReceitaService.deletarReceita(recipeId);

      res.json({ message: "Receita deletada com sucesso" });
    } catch (error: any) {
      console.error("Erro ao deletar receita:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // ✅ NOVO MÉTODO: Buscar receita específica por ID
  async getRecipeById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.id;
      const recipeId = req.params.id;

      const receita = await this.iaReceitaService.buscarReceitaPorId(recipeId);

      if (!receita) {
        return res.status(404).json({ error: "Receita não encontrada" });
      }

      // Verifica se a receita pertence ao usuário
      if (receita.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      res.json(receita);
    } catch (error: any) {
      console.error("Erro ao buscar receita:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export const recipeController = new RecipeController();
