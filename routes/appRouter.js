import express from 'express';
import * as userSearch from '../controllers/userSearch.js';
import userRoutes from '../routes/userRoutes.js'
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

export default router;