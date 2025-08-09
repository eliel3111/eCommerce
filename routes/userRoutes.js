import express from 'express';
import * as userController from '../controllers/userSearch.js';
import authMiddleware from '../middleware/auth.js';
import { getAllUsers, signupControl, verifyCodeControl } from '../controllers/user-controllers.js'
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

userRoutes.get("/login", (req, res) => {
  res.render("login.ejs", { messages: { error: req.flash("error") } });
});

userRoutes.get("/signup",(req, res) => {
  res.render('register.ejs');
});

userRoutes.get("/verify",(req, res) => {
  res.render('verify.ejs');
});

userRoutes.post("/signup", validate(signupValidator), signupControl);

userRoutes.post('/verify-code', verifyCodeControl);

userRoutes.post("/login", validate(loginValidator), passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
}));


passport.use(
    new Strategy(
        {passReqToCallback: true }, 
        async function verify(req, username, password, cb) {
        console.log(username);
        console.log(password);

        try {
            const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log("El usuario encontrado es:", user);
                const storeHashedPassword = user.contrasena;
                console.log("La contrasena encontrado es:", storeHashedPassword);
                bcrypt.compare(password, storeHashedPassword, (err, result) => {
                    if (err) {
                        req.flash('error', 'Este usuario no existe mi loco');
                        return cb(null, false);
                    } else {
                        if (result) {
                            return cb(null, user);
                        } else {
                            req.flash('error', 'Contraseña incorrecta');
                            return cb(null, false);
                        }
                    }
                });
            } else {
                req.flash('error', 'Este usuario no existe mi loco');
                return cb(null, false);
            }
        } catch (err) {
            console.log("error 2:" + err)
            return cb("El error es:" + err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user)
});
     


export default userRoutes;