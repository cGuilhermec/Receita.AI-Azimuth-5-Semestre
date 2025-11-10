import mongoose, { Schema, Document } from "mongoose";

export interface IMensagem extends Document {
  chatId: string;
  userId: string;
  role: "user" | "ia";
  conteudo: string;
  isReceita?: boolean;
  titulo?: string;
  ingredientes?: string[];
  modo_preparo?: string;
  criadoEm: Date;
}

const MensagemSchema = new Schema<IMensagem>({
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  role: { type: String, enum: ["user", "ia"], required: true },
  conteudo: { type: String, required: true },
  isReceita: { type: Boolean, default: false },
  titulo: { type: String },
  ingredientes: { type: [String] },
  modo_preparo: { type: String },
  criadoEm: { type: Date, default: Date.now },
});

export const MensagemMongooseModel = mongoose.model<IMensagem>(
  "Mensagem",
  MensagemSchema
);

export class MensagemModel {
  async addMensagem(data: IMensagem) {
    return MensagemMongooseModel.create(data);
  }

  async getMensagensByChat(chatId: string, limit = 20) {
    // Retorna as últimas 10 mensagens
    return MensagemMongooseModel.find({ chatId })
      .sort({ criadoEm: 1 })
      .limit(limit)
      .lean();
  }
}
