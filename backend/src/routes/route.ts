// routes/index.ts
import express from "express";
import { userController } from "../controllers/UserController";
import { iaReceitaController } from "../controllers/IaReceitaController";
import { guestIaController } from "../controllers/GuestIaController";
import multer from "multer";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { recipeController } from "../controllers/RecipeController";

export const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId || "guest"; // Agora aceita "guest" também
    cb(null, `${userId}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rotas públicas
router.post("/user", userController.createUser.bind(userController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));

// NOVA ROTA: IA para convidados (sem autenticação)
router.post("/chat/ia/guest", upload.single("imagem"), guestIaController.enviarMensagem.bind(guestIaController));

// Rotas protegidas (requerem autenticação)
router.get("/me", authMiddleware, authController.me.bind(authController));
router.get("/profile", authMiddleware, userController.getUserProfile.bind(userController));
router.put("/profile", authMiddleware, userController.updateUser.bind(userController));
router.post("/chat/ia", authMiddleware, upload.single("imagem"), iaReceitaController.enviarMensagem.bind(iaReceitaController));
router.get("/recipes/my-recipes", authMiddleware, recipeController.getUserRecipes.bind(recipeController));
router.post("/recipes/save", authMiddleware, recipeController.saveRecipe.bind(recipeController));
router.delete("/recipes/:id", authMiddleware, recipeController.deleteRecipe.bind(recipeController));

// Rota para buscar usuário por ID
router.get("/user/:id", authMiddleware, userController.findUserById.bind(userController));