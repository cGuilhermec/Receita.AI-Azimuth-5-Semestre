import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const token = await this.authService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return res.status(200).json({
        message: "Login realizado com sucesso! ✅",
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout realizado com sucesso!" });
  }

  async me(req: Request, res: Response) {
    const user = (req as any).user;

    return res.status(200).json({
      message: "Usuário autenticado ✅",
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

export const authController = new AuthController();
