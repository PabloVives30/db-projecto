import Router from "express";
import Usuario from '../controllers/Usuario.js';
import Transferencias from '../controllers/Transacciones.js'
import corsop, { verifyToken } from '../middlewares/Usuario.middleware.js';

const router = Router();
//Transacciones
router.get("/filtro", Transferencias.filtro);
router.post("/transferir", verifyToken, Transferencias.transferirDinero);
router.post("/simtransferencia", verifyToken, Transferencias.transferirDineroSimulacion);
router.put("/recargarSaldo", verifyToken, Usuario.recargarSaldo);
router.get("/verTransacciones", verifyToken, Transferencias.verTransacciones)

export default router;