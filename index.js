// =======================
// 📦 Import Dependencies
// =======================
import express from "express";
import ejs from "ejs"
import path from "path";
import axios from "axios";
import bodyParser from "body-parser";
import { log } from "async";
import appRouter from './routes/appRouter.js';
import morgan from "morgan";
import session from 'express-session';
import passport from 'passport';
import flash from "connect-flash";
import dotenv from "dotenv";

dotenv.config(); 

// =======================
// 🚀 Server Configuration
// =======================
const app = express();
const port = 3000;
app.use(express.json()); // Parses incoming JSON

// Si usas ES Modules, para obtener __dirname:
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
); 

app.use(flash());



app.use(passport.initialize());
app.use(passport.session());

// ✅ Middleware global único
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Usuario autenticado o null
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.messages = req.flash(); // Mensajes flash disponibles en las vistas
  next();
});






// ==================================================================
// 🛠 Axios Config
//  ==================================================================
const config = {
   headers: { 
    'Content-Type': 'application/json',
 },
  };
const GEONAMES_USERNAME = 'eliel3111'; // reemplazá con tu usuario real
//  ==================================================================
// ⚙️ Middleware
//  ==================================================================

// Static files (CSS, JS, etc.)
app.use(express.static("public"));

//Para decodificar el HTML
app.use(bodyParser.urlencoded({ extended:true}));

// Custom logger middleware
app.use(logger);

//REMOVE IN PRODUCCION
app.use(morgan("dev"));










// ==================================================================
// 🌐 Routes
// ==================================================================


app.use('/', appRouter);

/* Ruta para enviar las ciudades al frontend
app.get("/api/cities",async (req, res) => {
  res.json(sectorsByCity);
});  */


  // POST Search
app.post("/search", async (req, res) => {
  //Chequiar si el input search esta vacio
    if (req.body.search === "") {
      res.redirect("/");
    } else {
      try {
        const response = await axios.post(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.body.search}`);
        const result = response.data;
        if (result.drinks === null) {
          res.redirect("/");
        } else {
          res.render("home.ejs", { content: result.drinks});
        }
        
        } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("home.ejs", {
        error: error.response.data,
        });
        }
    }
  });

  app.post("/anuncio", async (req, res) => {
    try {
      const response = await axios.post(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${req.body.id}`, config);
      const result = response.data;
      if (result.drinks === null) {
        res.redirect("/");
      } else {
        res.render("anuncio.ejs", { content: result.drinks});
      }
      
      } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("home.ejs", {
      error: error.response,
      });
      }
  });








// =======================
// 🖥 Start Server
// =======================
app.listen(port, () => {
    console.log(`Server in running on port ${port}`);
})

// =======================
// 📋 Logger Middleware
// =======================
function logger(req, res, next) {
    console.log(req.path);
  
    console.log("El request URL is:" + req.url)
    next();
  }