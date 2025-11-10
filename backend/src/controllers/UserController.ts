import { Request, Response } from "express";
import { UserService } from "../services/UserService";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Criar usuário
  async createUser(req: Request, res: Response) {
    const {
      name,
      email,
      password,
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
    } = req.body;

    try {
      const result = await this.userService.createUser({
        name,
        email,
        password,
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
      });

      if (result === true) {
        return res
          .status(201)
          .json({ message: `Usuário ${email} criado com sucesso!` });
      } else {
        return res.status(409).json({ message: result });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao criar usuário:", error.message);
        return res
          .status(500)
          .json({ message: "Erro ao criar usuário", error: error.message });
      } else {
        console.error("Erro desconhecido ao criar usuário:", error);
        return res
          .status(500)
          .json({ message: "Erro desconhecido ao criar usuário" });
      }
    }
  }

  // Buscar usuário por ID
  async findUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await this.userService.findUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", (error as Error).message);
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }

  // Atualizar usuário
  async updateUser(req: Request, res: Response) {
    const { id, ...updateData } = req.body;

    try {
      const updatedUser = await this.userService.updateUser(id, updateData);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", (error as Error).message);
      return res.status(500).json({
        message: "Erro ao atualizar usuário",
        error: (error as Error).message,
      });
    }
  }
}

export const userController = new UserController();
