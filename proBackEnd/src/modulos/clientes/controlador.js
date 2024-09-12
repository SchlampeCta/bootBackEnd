
const db = require('../../db/mysql');

const TABLA = 'tabla_registro';

const tablaAnime= 'registro_anime';

async function todos() {
    try {
        return await db.todos(TABLA);
    } catch (error) {
        throw error;  
    }
}

async function uno(id) {
    try {
        return await db.uno(TABLA, id);
    } catch (error) {
        throw error;  
    }
}

async function agregar(body) {
    try {
        return await db.agregar(TABLA, body);
    } catch (error) {
        throw error;  
    }
}

async function actualizar(id, body) {
    try {
        
        if (!id || isNaN(parseInt(id))) {
            throw new Error('ID no válido');
        }

        
        const data = { ...body, id };
        return await db.actualizar(TABLA, id, data);
    } catch (error) {
       
        console.error('Error en la función actualizar:', error);
        throw error;
    }
}



async function eliminar(body) {
    try {
        return await db.eliminar(TABLA, body);
    } catch (error) {
        throw error;  
    }
}

//Login usuarios
async function login(req, res) {
    const { correo, contraseña } = req.body;

    try {
        const usuario = await db.obtenerUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        const esCoincidente = await db.verificarContraseña(correo, contraseña);

        if (esCoincidente) {
            res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).send('Contraseña incorrecta');
        }
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
}

async function agregarAnime(body) {
    try {
        return await db.addAnime(tablaAnime, body);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    todos,
    agregar,
    uno,
    actualizar,
    eliminar,
    login,
    agregarAnime
};
