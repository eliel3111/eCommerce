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


export function getAllUsers(req, res, next) {
  console.log("Ruta de usuario funciona bien");
  next();
}  

export async function signupControl(req, res, next) {
    console.log("El usuario esta tratando de registrarse");
    const name = req.body.name;
    const email = req.body.username;
    const password = req.body.password;

    //Check if user exist
    const checkResult = await db.query("Select * FROM usuarios WHERE email = $1", [email]);

    console.log(checkResult.rows);

    if (checkResult.rows.length > 0) {
        return res.status(400).render('verify.ejs', {
          error: true,
          mensaje: "El correo ya existe, intenta iniciar sesión.",
          usuario: email
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

            res.render('verify.ejs', {
              mensaje: 'Se ha enviado un nuevo código de verificación a tu correo.',
              usuario: rows[0].email
            });
        } catch (error) {
            console.error('Error al insertar usuario:', error);
        }
        
    }
    next();
};



export async function verifyCodeControl(req, res) {
  const { email, codigo } = req.body;
  console.log(email);
  console.log(codigo);
  try {
    const result = await db.query(
      `SELECT codigo, fecha_codigo FROM usuarios WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { codigo: codigoGuardado, fecha_codigo } = result.rows[0];

    // Verifica si el código coincide
    if (codigo !== codigoGuardado) {
      return res.render('verify.ejs', {
              mensaje: 'Usuario no encontrado, introdúzcalo nuevamente',
              usuario: email
            });
    }

    // Verifica si el código ha expirado (ej: 60 minutos de validez)
    const expiracionMinutos = 60;
    const ahora = new Date();
    const diferenciaMs = ahora - new Date(fecha_codigo);
    const diferenciaMin = diferenciaMs / 1000 / 60;

    //reenviar CODIGO si esta vencido
    if (diferenciaMin > expiracionMinutos) {
        const newCodigo = Math.floor(100000 + Math.random() * 900000).toString();
        const fecha_codigo = new Date();

        const query = `
          UPDATE usuarios
          SET codigo = $2,
              fecha_codigo = $3
          WHERE email = $1
          RETURNING id, nombre, email, codigo, fecha_codigo
        `;

        const values = [email, newCodigo, fecha_codigo];

        try {
          const { rows } = await db.query(query, values);

        //cambiar esto en PRODUCION    
          const emailVerification = "eliel3111@gmail.com";

          await enviarCodigo(emailVerification, newCodigo);

          return res.render('verify.ejs', {
              mensaje: 'Usuario no encontrado, introdúzcalo nuevamente',
              usuario: email
            }); 

        } catch (error) {
          console.error('Error al actualizar el usuario con el código:', error);
          return res.status(500).json({
            error: true,
            message: 'Error al actualizar el código de verificación'
          });
        }
}


    // Aquí puedes marcar el correo como verificado en la base de datos
    await db.query(`UPDATE usuarios SET verificado = true WHERE email = $1`, [email]);

    res.json({ message: 'Correo verificado exitosamente' });

  } catch (error) {
    console.error('Error al verificar código:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};




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