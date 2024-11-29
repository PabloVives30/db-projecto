import Router from "express";
import Registro from '../controllers/Registro.js';
import Usuario from '../controllers/Usuario.js';
import corsop, { verifyToken } from '../middlewares/Usuario.middleware.js';

const router = Router();
// Registro
router.post("/nuevo", Registro.AddUser);
// Logearse
router.post("/login", Usuario.Logearse);
router.get("/profile/:id", verifyToken, Usuario.Profile);
router.post("/forgotPassword", Usuario.forgotPassword);

export default router;