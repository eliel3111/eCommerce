import express from 'express';
import * as userSearch from '../controllers/userSearch.js';
import userRoutes from '../routes/userRoutes.js'
import anuncioRoutes from '../routes/AnuncioRouter.js';
import authMiddleware from '../middleware/auth.js';
import db from '../db.js';

//Organización del código por secciones (usuarios, productos, etc.)
const router = express.Router();


// GET Home
router.get("/", userSearch.getHome);

// Ruta para enviar las ciudades al frontend
router.get("/api/cities", userSearch.getCities); 


// For que busca los inmuebles en Home.ejs
router.get('/buscar-inmuebles', userSearch.homeSearch);

// Grupo de routes para users
router.use("/user", userRoutes);

// Grupo de routes para los anuncios
router.use("/anuncio", anuncioRoutes);

// Ruta para ver todos los inmuebles (página con filtros)
router.get("/inmuebles", (req, res) => {
  // Puedes enviar variables si lo necesitas
  res.render("search-properties", {
    anuncios: [],
    destacados: [],
    currentFilters: {} // 🔥 siempre lo envías
  });
});

/*router.post("/buscar", (req, res) => {
  console.log("🧩 Datos recibidos del formulario:");
  console.table(req.body); // 🔍 Muestra los valores como tabla en consola

  // Enviar respuesta visible en navegador
  res.send(`
    <h2>Datos recibidos del formulario</h2>
    <pre>${JSON.stringify(req.body, null, 2)}</pre>
    <a href="/">← Volver</a>
  `);
});*/


router.post("/inmuebles", userSearch.searchProperties);




export default router;