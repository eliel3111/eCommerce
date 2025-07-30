import express from 'express';
import * as userController from '../controllers/userSearch.js';
import authMiddleware from '../middleware/auth.js';
import { getAllUsers } from '../controllers/user-controllers.js'
import { Router } from 'express';
import { loginValidator, signupValidator, validate } from '../middleware/validators.js'
//Quitar esto cuando se mueva la accion de signup a los controllers:
import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
const saltRounds = 10;
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



//Organización del código por secciones (usuarios, productos, etc.)
const userRoutes = Router();


// GET Home
//conuserRoutes.get("/", getAllUsers);

userRoutes.get("/signup",(req, res) => {
  res.render('register.ejs');
});

userRoutes.post("/signup", validate(signupValidator), async (req, res) => {
    console.log("El usuario esta tratando de registrarse");
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    //Check if user exist
    const checkResult = await db.query("Select * FROM usuarios WHERE email = $1", [email]);

    console.log(checkResult.rows);

    if (checkResult.rows.length > 0) {
        res.status(400).json({
            error: true,
            message: "El correo ya existe, intenta iniciar sesión.",
            user: {
                name: name,
                email: email
            }
        });

    } else {
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const fecha_codigo = new Date();

        // Hashear la contraseña
        const newPassword = await bcrypt.hash(password, saltRounds);
        console.log('Password hasheado:', newPassword);

        const query = `
            INSERT INTO usuarios (nombre, email, contrasena, codigo, fecha_codigo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nombre, email, tipo_usuario, fecha_creacion, codigo
            `;

        const values = [name, email, newPassword, codigo, fecha_codigo];

        try {
            const { rows } = await db.query(query, values);
            const emailVerification = "eliel3111@gmail.com"
            await enviarCodigo(emailVerification, codigo);

            res.json({
                message: 'Usuario creado',
                user: rows[0]
            });
        } catch (error) {
            console.error('Error al insertar usuario:', error);
        }
        // res.render("Secrets.ejs");
    }
});

userRoutes.post("/login", validate(loginValidator), async (req, res) => {
    console.log("El usuario esta tratando de entrar");
    const email = req.body.email;
    const password = req.body.password;

    //Check if user exist
    const checkResult = await db.query("Select * FROM usuarios WHERE email = $1", [email]);

    console.log(checkResult.rows);

    res.send({
        userEmail: email,
        userPass: password
    });
});




async function enviarCodigo(emailDestino, codigo) {
    if (!emailDestino) {
        console.error('Error: No se proporcionó un destinatario de correo');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailDestino, // 👈 Asegúrate que esto tenga un valor válido
        subject: 'Código de verificación de vendio',
        text: `Tu código de verificación es: ${codigo}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente');
    } catch (error) {
        console.error('Error enviando correo:', error);
    }
}


export default userRoutes;