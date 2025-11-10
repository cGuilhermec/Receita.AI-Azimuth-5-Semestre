import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean; // Celíaco
  lactose_intolerant?: boolean;
  high_cholesterol?: boolean;
  diabetes?: boolean;
  hypertension?: boolean;
  allergies?: string | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  gender: { type: String, default: null },
  vegetarian: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  gluten_free: { type: Boolean, default: false },
  lactose_intolerant: { type: Boolean, default: false },
  high_cholesterol: { type: Boolean, default: false },
  diabetes: { type: Boolean, default: false },
  hypertension: { type: Boolean, default: false },
  allergies: { type: String, default: null },
});

const User = mongoose.model<IUser>("User", UserSchema);

export class UserModel {
  async createUser(user: IUser): Promise<void> {
    await User.create(user);
  }

  async findUserByEmail(email: string) {
    const result = await User.findOne({ email: email });
    return result;
  }

  async findUserById(id: string) {
    return await User.findById(id);
  }

  async updateUser(id: string, updateData: Partial<IUser>) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getUserInfo(userId: string) {
    console.log(`🔍 [USER MODEL] Buscando usuário com ID: ${userId}`);
    console.log(`🔍 [USER MODEL] Tipo do ID: ${typeof userId}`);

    let user;

    // Tenta buscar por _id primeiro (se for um ObjectId válido)
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
      console.log(
        `🔍 [USER MODEL] Busca por _id:`,
        user ? "Encontrado" : "Não encontrado"
      );
    }

    // Se não encontrou por _id, tenta por email ou outro campo
    if (!user) {
      user = await User.findOne({ email: userId });
      console.log(
        `🔍 [USER MODEL] Busca por email:`,
        user ? "Encontrado" : "Não encontrado"
      );
    }

    // Se ainda não encontrou, tenta por name
    if (!user) {
      user = await User.findOne({ name: userId });
      console.log(
        `🔍 [USER MODEL] Busca por name:`,
        user ? "Encontrado" : "Não encontrado"
      );
    }

    if (!user) {
      console.log(`❌ [USER MODEL] Usuário não encontrado com nenhum critério`);
      throw new Error("User not found");
    }

    console.log(`✅ [USER MODEL] Usuário encontrado:`, user);

    // Retorna apenas os campos relevantes
    const {
      weight,
      height,
      gender,
      vegetarian,
      vegan,
      gluten_free,
      lactose_intolerant,
      high_cholesterol,
      diabetes,
      hypertension,
      allergies,
    } = user;

    return {
      weight,
      height,
      gender,
      vegetarian,
      vegan,
      gluten_free,
      lactose_intolerant,
      high_cholesterol,
      diabetes,
      hypertension,
      allergies,
    };
  }
}
