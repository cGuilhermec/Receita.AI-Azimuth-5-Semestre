import { Request, Response } from "express";
import { IaReceitaService } from "../services/IaReceitaService";
import multer from "multer";
import path from "path";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const upload = multer({ storage });

export class IaReceitaController {
  // Mude para export class
  private iaReceitaService: IaReceitaService;

  constructor() {
    this.iaReceitaService = new IaReceitaService();
  }

  enviarMensagem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { chatId, texto } = req.body;
      const file = req.file;

      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.id;
      const nome = req.user.name;

      const textoFinal = texto || "Analise os ingredientes da imagem";
      const caminhoImagem = file ? path.resolve(file.path) : undefined;

      const resultado = await this.iaReceitaService.enviarMensagem(
        userId,
        chatId || null,
        nome,
        textoFinal,
        caminhoImagem
      );

      return res.status(200).json(resultado);
    } catch (error: any) {
      console.error("Erro no controller da IA:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  };
}

// Exporte a instância corretamente
export const iaReceitaController = new IaReceitaController();
