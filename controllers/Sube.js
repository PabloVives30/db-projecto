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

export default {
    ingresarSube,
    traersube
};
