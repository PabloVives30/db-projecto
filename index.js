import express from "express";
import AuthRouter from "./Routes/auth.routes.js";
import infoCuentarouter from "./Routes/infoCuenta.routes.js";
import serviciosRouter from "./Routes/servicios.routes.js";
import TransaccionesRouter from "./Routes/transacciones.routes.js";
import cors from "cors";
import "dotenv/config";

// import { getSaldo, transferirDinero, getTransacciones } from './controllers/wallet.js';

const app = express();
/* const port = 3000;*/
const PORT = process.env.PORT || 3000;

// Middleware

//app.use(cors(corsop.corsOptions));
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.send("Wallet TIC server is working");
});

app.use("/info", infoCuentarouter);
app.use("/auth", AuthRouter);
app.use("/servicios", serviciosRouter);
app.use("/transacciones", TransaccionesRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
