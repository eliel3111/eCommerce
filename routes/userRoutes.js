import express from 'express';
import * as userController from '../controllers/userControllers.js';
import authMiddleware from '../middleware/auth.js';
import { getAllUsers } from '../controllers/userControllers.js'

//Organización del código por secciones (usuarios, productos, etc.)
const userRoutes = express.Router();


// GET Home
userRoutes.get("/", getAllUsers);



export default userRoutes;