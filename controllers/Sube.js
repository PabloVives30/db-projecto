import pool from "../dbconfig.js";

const ingresarSube = async (req, res) => {
    try {
        const userId = req.id;
        const { nroSube, tipo } = req.body;

        console.log("userId:", userId);
        console.log("nroSube:", nroSube);
        console.log("tipo:", tipo);

        if (!userId || !nroSube) {
            console.error("Error: Faltan datos (userId o nroSube)");
            return res.status(400).json({ error: "Datos faltantes: userId o nroSube no proporcionados" });
        }

        const query = 'INSERT INTO sube (id_usuario, "numeroSube", tipo) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [userId, nroSube, tipo]);

        console.log("Resultado de la inserción:", result.rows);
        
        res.json({ success: true, message: "Número de Sube ingresado correctamente", data: result.rows });
    } catch (error) {
        console.error("Error en el servidor al ingresar la sube:", error);
        res.status(500).json({ error: "Error en el servidor al ingresar el número de Sube" });
    }
};


const traersube = async (req, res) => {
    try {
        const userId = req.id;  
        const query = 'SELECT "numeroSube", tipo FROM sube WHERE id_usuario = $1';
        const result = await pool.query(query, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los datos de la sube:", error);
        res.status(500).json({ error: "Error al obtener los datos de la sube" });
    }
};

const pagarSube = async (req, res) => {
    try {
        const userId = req.id;
        const { montoSube } = req.body; 

        await pool.query("BEGIN");

        const querySaldo = "SELECT saldo FROM perfil WHERE id = $1";
        const usuario = await pool.query(querySaldo, [userId]);
        if (usuario.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }

        const saldoUsuario = usuario.rows[0].saldo;
        if (saldoUsuario < montoSube) {
            return res.status(400).json({ success: false, message: "Saldo insuficiente" });
        }

        const queryRestarSaldo = "UPDATE perfil SET saldo = saldo - $1 WHERE id = $2";
        await pool.query(queryRestarSaldo, [montoSube, userId]);

        const queryInsertarPago = `
            INSERT INTO transacciones (id_user, destino, fecha, monto)
            VALUES ($1, $2, $3, $4) RETURNING id`;
        const pagoSube = await pool.query(queryInsertarPago, [
            userId,
            0, // ID de "SUBE" en la tabla perfil
            new Date(),
            montoSube
        ]);

    
        await pool.query("COMMIT");

        return res.status(200).json({ 
            success: true, 
            message: "Pago de SUBE realizado con éxito", 
            pagoId: pagoSube.rows[0].id 
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error en el pago de la SUBE:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};


export default {
    ingresarSube,
    traersube,
    pagarSube
};
