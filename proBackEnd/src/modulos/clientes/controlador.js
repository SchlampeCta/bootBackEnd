
const db = require('../../db/mysql');

const TABLA = 'tabla_registro';

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
        // Validación del ID
        if (!id || isNaN(parseInt(id))) {
            throw new Error('ID no válido');
        }

        // Llamada a la función de actualización en la base de datos
        const data = { ...body, id };
        return await db.actualizar(TABLA, id, data);
    } catch (error) {
        // Manejo de errores
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


module.exports = {
    todos,
    agregar,
    uno,
    actualizar,
    eliminar,
};
