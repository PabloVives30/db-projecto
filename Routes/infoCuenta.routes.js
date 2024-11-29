import Router from "express";
import Usuario from '../controllers/Usuario.js';
import corsop, { verifyToken } from '../middlewares/Usuario.middleware.js';

const router = Router();
// Funciones de menor importancia
router.get("/usuarioInfo", verifyToken, Usuario.usuarioInfo);   
router.get('/infoPersona', verifyToken, Usuario.infoPersona);
router.get("/compartir", verifyToken, Usuario.compartir);
router.get("/verSaldo", verifyToken, Usuario.verSaldo);

export default router;