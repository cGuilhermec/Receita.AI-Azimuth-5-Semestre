import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/UserModel";

export class AuthService {
  private userModel = new UserModel();

  async login(email: string, password: string) {
    const user = await this.userModel.findUserByEmail(email);

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "7d" }
    );

    return token;
  }
}
