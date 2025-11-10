import express from "express";
import { userController } from "../controllers/UserController";
import { iaReceitaController } from "../controllers/IaReceitaController";
import multer from "multer";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // pasta onde será salvo
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId || "user"; // garante que userId exista
    cb(null, `${userId}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


//Creating a new user without authentication
router.post("/user", userController.createUser.bind(userController));

router.post("/chat/ia", authMiddleware, upload.single("imagem"), iaReceitaController.enviarMensagem.bind(iaReceitaController));

//Login e logout
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/me", authMiddleware, authController.me.bind(authController));