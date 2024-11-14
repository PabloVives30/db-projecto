import pool from "../dbconfig.js";

const RegistrarTelefono = async (req, res) => {
    try{
        const userId = req.id
        const { nroTelefono, tipoEmpresa } = req.body

        const query = 'INSERT INTO celular (id_user, "nroCelular", "Tipo") VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query,[userId, nroTelefono, tipoEmpresa]);
        console.log("Resultado de la inserción:", result.rows);

        res.json({ success: true, message: "Número de Sube ingresado correctamente", data: result.rows });
    }catch(error){
        console.error("Error en el servidor al ingresar el telefono:", error);
        res.status(500).json({ error: "Error en el servidor al ingresar el número del telefono" });
    }
};

const verTelefonos = async (req, res) => {
    try {
        const userId = req.id;  
        const query = 'SELECT "nroCelular", "Tipo" FROM celular WHERE id_user = $1';
        const result = await pool.query(query, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los datos del telefono:", error);
        res.status(500).json({ error: "Error al obtener los datos del telefono" });
    }
}

const pagarTelefono = async (req, res) => {
    try {
        const userId = req.id;
        const { montoTelefono, telefonoDestino } = req.body;

        await pool.query("BEGIN");

        // Consultar el saldo del usuario
        const querySaldo = "SELECT saldo FROM perfil WHERE id = $1";
        const usuario = await pool.query(querySaldo, [userId]);
        if (usuario.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }

        const saldoUsuario = usuario.rows[0].saldo;
        if (saldoUsuario < montoTelefono) {
            return res.status(400).json({ success: false, message: "Saldo insuficiente" });
        }

        // Restar el saldo
        const queryRestarSaldo = "UPDATE perfil SET saldo = saldo - $1 WHERE id = $2";
        await pool.query(queryRestarSaldo, [montoTelefono, userId]);

        // Insertar el registro de la transacción
        const queryInsertarPago = `
            INSERT INTO transacciones (id_user, destino, fecha, monto)
            VALUES ($1, $2, $3, $4) RETURNING id`;
        const pagoTelefono = await pool.query(queryInsertarPago, [
            userId,
            telefonoDestino, // Debes enviar el id correcto del teléfono destino
            new Date(),
            montoTelefono
        ]);

        await pool.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Pago de teléfono realizado con éxito",
            pagoId: pagoTelefono.rows[0].id
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error en el pago del teléfono:", error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};


const Telefono = {
    RegistrarTelefono,
    verTelefonos,
    pagarTelefono
}
export default Telefono;