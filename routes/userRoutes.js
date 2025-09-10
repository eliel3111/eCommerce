import express from 'express';
import * as userController from '../controllers/userSearch.js';
import authMiddleware from '../middleware/auth.js';
import { getAllUsers, signupControl, verifyCodeControl, forgotPassControl } from '../controllers/user-controllers.js'
import { Router } from 'express';
import { loginValidator, signupValidator, validate } from '../middleware/validators.js'
//Quitar esto cuando se mueva la accion de signup a los controllers:
import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import flash from "connect-flash";
import passport from 'passport';
import LocalStrategy, { Strategy } from 'passport-local';
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; 

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


// GET 

userRoutes.get("/login", (req, res) => {
  res.render("login.ejs");
});

userRoutes.get("/signup",(req, res) => {
  res.render('register.ejs');
});

userRoutes.get("/verify",(req, res) => {
  res.render('verify.ejs');
});

userRoutes.get("/forgot-password",(req, res) => {
  res.render('forgot-password.ejs');
});

userRoutes.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback de Google (después de login)
userRoutes.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // ✅ Aquí ya tienes al usuario logueado
    res.redirect("/"); 
  }
);

userRoutes.post("/signup", validate(signupValidator), signupControl);

userRoutes.post('/verify-code', verifyCodeControl);

userRoutes.post("/login", validate(loginValidator), passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
}));

userRoutes.post("/forgot-password", forgotPassControl);

passport.use(
    new Strategy(
        {passReqToCallback: true }, 
        async function verify(req, username, password, cb) {

        try {
            const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const storeHashedPassword = user.contrasena;
                bcrypt.compare(password, storeHashedPassword, (err, result) => {
                    if (err) {
                        
                        return cb(null, false, { message: 'Error. Contacte al soporte técnico.'});
                    } else {
                        if (result) {
                            return cb(null, user);
                        } else {

                            return cb(null, false, { message: 'Contraseña incorrecta'});
                        }
                    }
                });
            } else {

                return cb(null, false, {message: 'Usuario no existe. Cree una cuenta.' });
            }
        } catch (err) {
            return cb("El error es:" + err);
        }
    })
);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    const username = profile.emails[0].value;
    // Here you would check if the user exists in DB, if not create them
    // profile contains Google user info
    try {
            const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                return cb(null, result.rows[0]);
                
            } else {
                const query = `
                    INSERT INTO users (email, provider, profile_id, nombre, verificado, fecha_creacion)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *;
                `;

                const values = [
                    profile.emails[0].value,   // email
                    "google",                  // provider
                    profile.id,                // profile_id
                    profile.displayName,       // nombre
                    true,                      // verificado
                    new Date()                 // fecha_creacion
                ];
                const insertResult = await db.query(insertQuery, values);
                return cb(null, insertResult.rows[0]);
            }
        } catch (err) {
            return cb("El error es:" + err);
        }
    return cb(null, profile);
  }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user)
});
     


export default userRoutes;