// controllers/GuestIaController.ts
import { Request, Response } from "express";
import { IaReceitaService } from "../services/IaReceitaService";
import path from "path";

export class GuestIaController {
  private iaReceitaService: IaReceitaService;

  constructor() {
    this.iaReceitaService = new IaReceitaService();
  }

  enviarMensagem = async (req: Request, res: Response) => {
    try {
      console.log("📥 Recebendo requisição guest:", {
        body: req.body,
        file: req.file ? `Arquivo: ${req.file.originalname}` : "Sem arquivo",
        headers: req.headers,
      });
      const { chatId, texto } = req.body;
      const file = req.file;

      // Gera um ID único para o convidado
      const guestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const nome = "Convidado";

      const textoFinal =
        texto || "Analise os ingredientes da imagem e crie uma receita";
      const caminhoImagem = file ? path.resolve(file.path) : undefined;

      const resultado = await this.iaReceitaService.enviarMensagem(
        guestId, // Usa o guestId em vez de userId
        chatId || null,
        nome,
        textoFinal,
        caminhoImagem
      );

      return res.status(200).json(resultado);
    } catch (error: any) {
      console.error("Erro no controller da IA para convidados:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  };
}

export const guestIaController = new GuestIaController();
