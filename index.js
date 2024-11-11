import express from "express";
import ejs from "ejs"
import axios from "axios";
import bodyParser from "body-parser";
//SERVER
const app = express();
const port = 3000;
//MIDLEWARE
//Para poder acceder los CCS
app.use(express.static("public"));


//Para decodificar el HTML
app.use(bodyParser.urlencoded({ extended:true}));

//HANDLE
app.get("/", (req, res) => {
    res.render("home.ejs", { content: "Waiting for data..." });
  });
//SERVER
app.listen(port, () => {
    console.log(`Server in running on port ${port}`);
})