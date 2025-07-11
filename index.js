// =======================
// 📦 Import Dependencies
// =======================
import express from "express";
import ejs from "ejs"
import axios from "axios";
import bodyParser from "body-parser";
import { log } from "async";
import appRouter from './routes/appRouter.js';
// =======================
// 🚀 Server Configuration
// =======================
const app = express();
const port = 3000;
app.use(express.json()); // Parses incoming JSON

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
  console.log(typeof(req.body.search));
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
    console.log(req.body.id);
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