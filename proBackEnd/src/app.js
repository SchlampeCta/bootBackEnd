const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const cors = require('cors');


const clientes = require('./modulos/clientes/rutas');
const error = require('./red/error');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'https://mi-primer-anime.netlify.app'
}));


// Configuración de middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del puerto
app.set('port', config.app.port);

// Rutas
app.use('/api/clientes', clientes);

// Middleware de manejo de errores (debe estar al final)
app.use(error);

module.exports = app;

