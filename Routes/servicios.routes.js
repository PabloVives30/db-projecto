import Router from "express";
import Sube from '../controllers/Sube.js'
import Impuesto from '../controllers/Impuesto.js'
import Telefono from '../controllers/Telefono.js';
import corsop, { verifyToken } from '../middlewares/Usuario.middleware.js';

const router = Router();
// Funcion Recargar Celular
router.post("/RegistrarTelefono", verifyToken, Telefono.RegistrarTelefono);
router.get("/verTelefonos", verifyToken, Telefono.verTelefonos);
router.post("/pagarTelefono", verifyToken, Telefono.pagarTelefono);

// Funcion Recargar Sube
router.post("/ingresarSube", verifyToken, Sube.ingresarSube);
router.get("/traerSube", verifyToken, Sube.traersube);
router.post("/pagarSube", verifyToken, Sube.pagarSube)

// Funcion Pagar Impuestos
router.post("/ingresarImpuesto", verifyToken, Impuesto.ingresarImpuesto)
router.get("/traerImpuesto", verifyToken, Impuesto.traerImpuestos)
router.post("/verimpuestos", verifyToken, Impuesto.VerImpuestos);
router.post("/pagarImpuesto", verifyToken, Impuesto.PagarImpuesto);

export default router;