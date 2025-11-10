import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChat extends Document {
  _id: Types.ObjectId;
  userId: string;
  titulo?: string;
  messages: IMessage[];
  criadoEm?: Date;
}

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true },
  titulo: { type: String },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  criadoEm: { type: Date, default: Date.now },
});

const ChatMongooseModel = model<IChat>("Chat", ChatSchema);

export class ChatModel {
  async createChat(userId: string, titulo?: string): Promise<IChat> {
    return await ChatMongooseModel.create({ userId, titulo, messages: [] });
  }

  async findChatByUser(userId: string): Promise<IChat[]> {
    return await ChatMongooseModel.find({ userId }).sort({ criadoEm: -1 });
  }

  async findChatById(chatId: string): Promise<IChat | null> {
    return await ChatMongooseModel.findById(chatId);
  }
}
