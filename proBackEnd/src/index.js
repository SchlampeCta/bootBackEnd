const app = require('./app'); 
const config = require('./config');

// Inicia el servidor
app.listen(config.app.port, (err) => {
    if (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1); 
    } else {
        console.log(`Servidor escuchando en el puerto ${config.app.port}`);
    }
});
