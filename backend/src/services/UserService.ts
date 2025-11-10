import { hash } from "bcryptjs";
import { IUser, UserModel } from "../model/UserModel";
import { IUserInput } from "../interfaces/IUserInput";

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  // Criar usuário
  async createUser(user: IUserInput) {
    const existingUser = await this.userModel.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash da senha
    const hashedPassword = await hash(user.password, 8);
    user.password = hashedPassword;

    // Cria usuário no banco
    await this.userModel.createUser(user as IUser);

    return true;
  }

  // Buscar usuário por ID
  async findUserById(id: string) {
    const userDoc = await this.userModel.findUserById(id);
    if (!userDoc) {
      throw new Error("User not found");
    }

    const user = userDoc.toObject();

    // Remover campos sensíveis antes de retornar
    const { password, _id, __v, ...response } = user;
    return response;
  }

  // Atualizar usuário
  async updateUser(id: string, data: Partial<IUserInput>) {
    const userDoc = await this.userModel.findUserById(id);
    if (!userDoc) {
      throw new Error("User not found");
    }

    const updateData: Partial<IUser> = {};

    // Senha (hash)
    if (data.password) {
      const hashedPassword = await hash(data.password, 8);
      updateData.password = hashedPassword;
    }

    // Outros campos
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.vegetarian !== undefined) updateData.vegetarian = data.vegetarian;
    if (data.vegan !== undefined) updateData.vegan = data.vegan;
    if (data.gluten_free !== undefined)
      updateData.gluten_free = data.gluten_free;
    if (data.lactose_intolerant !== undefined)
      updateData.lactose_intolerant = data.lactose_intolerant;
    if (data.high_cholesterol !== undefined)
      updateData.high_cholesterol = data.high_cholesterol;
    if (data.diabetes !== undefined) updateData.diabetes = data.diabetes;
    if (data.hypertension !== undefined)
      updateData.hypertension = data.hypertension;
    if (data.allergies !== undefined) updateData.allergies = data.allergies;

    // Atualiza no banco
    const updatedUserDoc = await this.userModel.updateUser(id, updateData);

    const user = updatedUserDoc!.toObject();

    // Remove campos sensíveis antes de retornar
    const { password, _id, __v, ...response } = user;
    return response;
  }
}
