import express from 'express';
import * as userController from '../controllers/userControllers.js';
import authMiddleware from '../middleware/auth.js';

//Organización del código por secciones (usuarios, productos, etc.)
const router = express.Router();


// GET Home
router.get("/", userController.getHome);

// Ruta para enviar las ciudades al frontend
router.get("/api/cities", userController.getCities); 

// Grupo de routes para users
//router.get("/user", userRoutes);

export default router;
