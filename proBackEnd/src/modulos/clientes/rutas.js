const express = require('express');
// Importar respuestas
const respuesta = require('../../red/respuesta');
const controlador = require('./controlador');
const router = express.Router();

// Ruta para obtener todos los items
router.get('/', async (req, res, next) => {
   try {
      const items = await controlador.todos();
      res.status(200).send({
         error: false,
         status: 200,
         body: items
      });
   } catch (err) {
      next(err); // Pasa el error al middleware de manejo de errores
   }
});

// Ruta para obtener un item por ID
router.get('/:id', async function (req, res) {
   try {
      const item = await controlador.uno(req.params.id);
      if (item) {
         respuesta.success(req, res, item, 200);
      } else {
         respuesta.error(req, res, 'Item no encontrado', 404);
      }
   } catch (err) {
      console.error('Error al obtener el ítem:', err);
      respuesta.error(req, res, 'Error al obtener el ítem', 500);
   }
});

// Ruta para agregar 
router.post('/add', async function (req, res, next) {
   try {
      const item = await controlador.agregar(req.body);
      const mensaje = req.body.id === 0 ? 'Guardado con éxito' : 'Guardado con exito';

      // Elegir el código de estado en función de la operación realizada
      const statusCode = req.body.id === 0 ? 201 : 200;

      respuesta.success(req, res, { item, mensaje }, statusCode);
   } catch (err) {
      next(err);
   }
});

//Ruta para actualizar
router.put('/actualizar/:id', async function (req, res, next) {
   try {
      const { id } = req.params;
      if (!id || isNaN(parseInt(id))) {
         return res.status(400).json({ error: true, message: 'ID no válido8' });
      }
      const data = { ...req.body, id }; 
      const item = await controlador.actualizar(data);
      const mensaje = 'Actualizado con éxito';
      const statusCode = 200;
      respuesta.success(req, res, { item, mensaje }, statusCode);
   } catch (err) {
      console.error('Error en la ruta /update/:id:', err);
      next(err);
   }
});


// Ruta para eliminar un item por ID 
router.delete('/eliminar/:id', async function (req, res, next) {
   try {
      const resultado = await controlador.eliminar({ id: req.params.id });
      respuesta.success(req, res, 'Item eliminado con éxito', 200);
   } catch (err) {
      next(err);
   }
});

// Ruta para el login
router.post('/login', async (req, res) => {
   const { correo, contraseña } = req.body;

   if (!correo || !contraseña) {
      return res.status(400).send('Correo y contraseña son requeridos');
   }

   try {
      const usuario = await db.obtenerUsuarioPorCorreo(correo); 

      if (!usuario) {
         return res.status(401).send('Correo no encontrado');
      }

      const esCoincidente = await db.verificarContraseña(correo, contraseña); 

      if (esCoincidente) {
         res.status(200).json({ mensaje: 'Login exitoso' });
      } else {
         res.status(401).send('Contraseña incorrecta');
      }
   } catch (error) {
      res.status(500).send('Error del servidor');
   }
});

// Ruta para insertar datos de animes
router.post('/addAnime', async function (req, res, next) {
   try {
      const item = await controlador.agregarAnime(req.body);
      const mensaje = req.body.id === 0 ? 'Anime guardado con éxito' : 'Anime actualizado con éxito';

      
      const statusCode = req.body.id === 0 ? 201 : 200;

      respuesta.success(req, res, { item, mensaje }, statusCode);
   } catch (err) {
      next(err);
   }
});


module.exports = router;
