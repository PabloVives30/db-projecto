import pool from "../dbconfig.js";

const RegistrarTelefono = async (req, res) => {
    try{
        const userId = req.id
        const { nroTelefono, tipoEmpresa } = req.body

        const query = 'INSERT INTO celular (id_usuario, "nroCelular", tipo) VALUES ($1, $2, $3) RETURNING *'
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
        const query = 'SELECT "nroCelular", tipo FROM celular WHERE id_usuario = $1';
        const result = await pool.query(query, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los datos del telefono:", error);
        res.status(500).json({ error: "Error al obtener los datos del telefono" });
    }
}

const Telefono = {
    RegistrarTelefono,
    verTelefonos
}
export default Telefono;