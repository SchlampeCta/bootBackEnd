const mysql = require('mysql');
const config = require('../config');
// Función para agregar datos (insertar o actualizar)
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de sal para el hashing

// Configuración de la base de datos
const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
};


// Variable de conexión
let conexion;

// Función para conectar a la base de datos
function conMysql() {
    conexion = mysql.createConnection(dbConfig);
    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        } else {
            console.log('Base de datos conectada!!!');
        }
    });
    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    });
}

// Llamar a la conexión
conMysql();

// Función para traer todos los datos de la tabla
function todos(tabla) {
    return new Promise((resolve, reject) => {
        if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
            return reject(new Error("Nombre de tabla no válido"));
        }
        conexion.query(`SELECT * FROM ??`, [tabla], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

// Función para traer un solo dato de la tabla
function uno(tabla, ID) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ?? WHERE ID = ?`, [tabla, ID], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}


// Función para agregar datos (insertar o actualizar)
async function agregar(tabla, data) {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar nombre de tabla
            if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
                return reject(new Error("Nombre de tabla no válido"));
            }

            // Verificar datos
            if (typeof data !== 'object' || Object.keys(data).length === 0) {
                return reject(new Error("Datos de inserción no válidos"));
            }

            // Encriptar la contraseña si existe
            if (data.password) {
                try {
                    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
                    data.password = hashedPassword;
                } catch (error) {
                    return reject(new Error("Error al cifrar la contraseña"));
                }
            }

            // Extraer columnas y valores
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${placeholders})`;

            // Ejecutar la consulta SQL
            conexion.query(sql, [tabla, ...values], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        } catch (error) {
            reject(error);
        }
    });
}


// Función para actualizar datos
async function actualizar(id, data) {
    try {
        if (!/^\d+$/.test(id)) {
            throw new Error('ID no válido');
        }

        // Verificar si hay una contraseña en los datos y cifrarla
        if (data.password) {
            data.password = await bcrypt.hash(data.password, saltRounds);
        }
        // Llamar la función de actualización de la base de datos
        return await db.actualizar(id, data);
    } catch (error) {
        throw error;
    }
}

/*
// Función para agregar datos (insertar o actualizar)
function agregar(tabla, data) {
    if (data && data.ID === 0) {
        return insertar(tabla, data);
    } else {
        return actualizar(tabla, data);
    }
}
*/
// Función para eliminar datos ESTO FUE LO ULTIMO QUE CAMBIE 
function eliminar(tabla, id) {
    return new Promise((resolve, reject) => {
        // Asegurarse de que el ID es válido
        if (!id || isNaN(parseInt(id))) {
            return reject(new Error('ID no válido'));
        }

        // Consulta para eliminar el registro por ID
        conexion.query(`DELETE FROM ?? WHERE ID = ?`, [tabla, id], (error, result) => {
            if (error) {
                return reject(error);
            }

            // Verificar si se eliminó algún registro
            if (result.affectedRows === 0) {
                return reject(new Error('No se encontró el registro para eliminar.'));
            }

            // Resolver la promesa si el registro fue eliminado con éxito
            resolve('Registro eliminado con éxito.');
        });
    });
}

// Función para verificar la contraseña
async function verificarContraseña(correo, contraseña) {
    return new Promise((resolve, reject) => {
        // Primero, obtén el hash de la contraseña desde la base de datos
        const sql = 'SELECT contraseña FROM usuarios WHERE correo = ?';
        conexion.query(sql, [correo], async (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length === 0) {
                return reject(new Error('Usuario no encontrado'));
            }

            const hashedPassword = results[0].contraseña;

            // Luego, compara la contraseña ingresada con el hash almacenado
            try {
                const esCoincidente = await bcrypt.compare(contraseña, hashedPassword);
                if (esCoincidente) {
                    resolve(true);
                } else {
                    reject(new Error('Contraseña incorrecta'));
                }
            } catch (error) {
                reject(new Error('Error al verificar la contraseña'));
            }
        });
    });
}



// Exportar las funciones
module.exports = {
    todos,
    agregar,
    uno,
    eliminar,
    actualizar,
    verificarContraseña
};
