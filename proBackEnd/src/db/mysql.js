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

// Función para traer todos los datos de la tabla de usuarios
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

// Función para traer un solo dato de la tabla de usuario
function uno(tabla, ID) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ?? WHERE ID = ?`, [tabla, ID], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

//Funcion para agregar los datos de usuarios
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

            // Verificar si las contraseñas coinciden
            if (data.password === data.confContraseña) {
                return reject(new Error("Las contraseñas no coinciden"));
            }

            // Encriptar la contraseña 
            if (data.password) {
                try {
                    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
                    data.password = hashedPassword; 
                    delete data.confContraseña; 
                } catch (error) {
                    return reject(new Error("Error al cifrar la contraseña"));
                }
            }

            
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${placeholders})`;

           
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

// Función para actualizar datos de usuarios
async function actualizar(id, data) {
    try {
        if (!/^\d+$/.test(id)) {
            throw new Error('ID no válido');
        }

        // Verificar si hay una contraseña en los datos y cifrarla
        if (data.password) {
            data.password = await bcrypt.hash(data.password, saltRounds);
        }
        
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
// Función para eliminar por ID datos usuario
function eliminar(tabla, id) {
    return new Promise((resolve, reject) => {
       
        if (!id || isNaN(parseInt(id))) {
            return reject(new Error('ID no válido'));
        }

        
        conexion.query(`DELETE FROM ?? WHERE ID = ?`, [tabla, id], (error, result) => {
            if (error) {
                return reject(error);
            }

           
            if (result.affectedRows === 0) {
                return reject(new Error('No se encontró el registro para eliminar.'));
            }

          
            resolve('Registro eliminado con éxito.');
        });
    });
}

// Función para verificar la contraseña usuarios 
async function verificarContraseña(correo, contraseña) {
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT contraseña FROM usuarios WHERE correo = ?';
        conexion.query(sql, [correo], async (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length === 0) {
                alert('Usuario no encontrado');
                return reject(new Error('Usuario no encontrado'));
            }

            const hashedPassword = results[0].contraseña;

            // Comparar la contraseña ingresada con el hash almacenado
            try {
                const esCoincidente = await bcrypt.compare(contraseña, hashedPassword);
                if (esCoincidente) {
                    resolve(true);
                } else {
                    alert('Contraseña incorrecta'); 
                    reject(new Error('Contraseña incorrecta'));
                }
            } catch (error) {
                alert('Error al verificar la contraseña'); 
                reject(new Error('Error al verificar la contraseña'));
            }
        });
    });
}

// Función para obtener un usuario por correo
function obtenerUsuarioPorCorreo(correo) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE correo = ?';
        conexion.query(sql, [correo], (error, results) => {
            if (error) return reject(error);
            resolve(results[0]); 
        });
    });
}

//funcion para insertar animes 
async function addAnime(data) {
    return new Promise((resolve, reject) => {
        try {
            // Verificar datos
            const requiredFields = ['nombre_JP', 'nombre_In', 'nombre_Es', 'descripcion', 'genero', 'subgenero'];
            for (const field of requiredFields) {
                if (!data[field] || data[field].trim() === '') {
                    return reject(new Error(`El campo ${field} es obligatorio`));
                }
            }

            // Construir la consulta SQL
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO registro_anime (${columns.join(', ')}) VALUES (${placeholders})`;

            // Ejecutar la consulta
            conexion.query(sql, values, (error, result) => {
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

// Función para insertar animes
async function addAnime(tabla, data) {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar nombre de la tabla
            if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
                return reject(new Error("Nombre de tabla no válido"));
            }

            // Verificar datos
            if (typeof data !== 'object' || Object.keys(data).length === 0) {
                return reject(new Error("Datos de inserción no válidos"));
            }

            // Verificar que los campos requeridos no estén vacíos
            const requiredFields = ['nombre_Jp', 'nombre_In', 'nombre_Es', 'descripcion', 'genero', 'subgenero'];
            for (let field of requiredFields) {
                if (!data[field]) {
                    return reject(new Error(`El campo ${field} es obligatorio desde mysql`));
                }
            }

            // Preparar la consulta SQL
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${placeholders})`;

            // Ejecutar la consulta
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


// Exportar las funciones
module.exports = {
    todos,
    agregar,
    uno,
    eliminar,
    actualizar,
    verificarContraseña,
    obtenerUsuarioPorCorreo,
    addAnime
};
