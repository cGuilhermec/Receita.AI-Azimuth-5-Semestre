import mongoose, { Schema, Document } from "mongoose";

export interface IIaReceita extends Document {
  userId: string;
  nomeUsuario: string;
  pergunta: string;
  resposta: string | object;
  isReceita: boolean;
  titulo?: string;
  ingredientes?: string[];
  modo_preparo?: string;
  data: Date;
}

const IaReceitaSchema = new Schema<IIaReceita>({
  userId: { type: String, required: true },
  nomeUsuario: { type: String, required: true },
  pergunta: { type: String, required: true },
  resposta: { type: Schema.Types.Mixed, required: true },
  isReceita: { type: Boolean, required: true },
  titulo: { type: String },
  ingredientes: { type: [String] },
  modo_preparo: { type: String },
  data: { type: Date, default: Date.now },
});

export const IaReceitaMongooseModel = mongoose.model<IIaReceita>(
  "IaReceita",
  IaReceitaSchema
);

export class IaReceitaModel {
  async createIaReceita(data: Partial<IIaReceita>) {
    return IaReceitaMongooseModel.create(data);
  }

  async findAllByUser(userId: string) {
    return IaReceitaMongooseModel.find({ userId }).sort({ data: -1 });
  }

  async findById(id: string) {
    return IaReceitaMongooseModel.findById(id);
  }

  async deleteById(id: string) {
    return IaReceitaMongooseModel.findByIdAndDelete(id);
  }
}
