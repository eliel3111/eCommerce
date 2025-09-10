import express from 'express';
import { Router } from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import upload from "../middleware/upload.js";
import ensureAuthenticated from "../middleware/auth.js";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import db from '../db.js';
import { type } from 'os';
import { Console } from 'console';

const anuncioRoutes = Router();
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});



anuncioRoutes.get("/", ensureAuthenticated, (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Página desde Express</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background: #f9f9f9; 
      text-align: center; 
      padding: 50px; 
    }
    h1 { color: #333; }
    button { 
      padding: 10px 20px; 
      background: #007bff; 
      color: white; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer; 
    }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <img src="https://vendido-aws-2025-bucket.s3.us-east-1.amazonaws.com/images/1756000542748_eliel.jpg" alt="Imagen">
  <h1>¡Hola desde Express! 🚀</h1>
  <p>Este HTML fue enviado directamente por el servidor.</p>
  <button onclick="alert('Botón funcionando!')">Haz click</button>
</body>
</html>
  `);
});

anuncioRoutes.get("/new", (req, res) => {
    /*console.log("📥 Query Params:", req.query);      // Si vienen parámetros en la URL
    console.log("📥 Body:", req.body);              // Si viene info en el body (aunque GET casi no lo usa)
    console.log("📥 Params:", req.params);          // Si defines algo como /new/:id
    console.log("📥 Usuario logueado:", req.user);  // El usuario autenticado (passport)*/ 

    res.render("newAnuncio.ejs");
});

// Endpoint para procesar el formulario

console.time("multer save");
anuncioRoutes.post("/prueba/new", upload.array("imagenes", 10), async (req, res) => {
console.timeEnd("multer save");
  try {
    // Todos los campos que no son archivos
    const {
      tipo_inmueble,
      titulo,
      descripcion,
      hab,
      banos,
      metros_cuadrados,
      parqueos,
      ciudad,
      sector,
      precio,
      moneda,
      amueblado,
      inmueble
    } = req.body;

    // Archivos subidos
    const archivos = req.files;


    console.log("📩 Datos del formulario:", req.body);
    console.log("📷 Archivos recibidos:", archivos);

    // Aquí podrías guardar en la base de datos...

    res.json({
      message: "Anuncio recibido correctamente",
      data: req.body,
      files: archivos
    });
  } catch (error) {
    console.error("Error en /anuncio/new:", error);
    res.status(500).json({ error: "Error al recibir el anuncio" });
  }
});

anuncioRoutes.post("/upload-images", upload.array("imagenes", 10), async (req, res) => {
  try {
    const files = req.files;
    const urls = [];

    for (const file of files) {
      const fileStream = fs.createReadStream(file.path);

      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `images/${Date.now()}_${file.originalname}`, // ✅ backticks
        Body: fileStream,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`; // ✅ backticks
      urls.push(fileUrl);

      // Elimina archivo temporal
      fs.unlinkSync(file.path);
    }


    
        const {
        tipo_inmueble,
        titulo,
        descripcion,
        hab,
        banos,
        metros_cuadrados,
        parqueos,
        ciudad,
        sector,
        moneda,
        inmueble
        } = req.body;

        // limpiar comas del precio
        const precio = req.body.precio ? req.body.precio.replace(/,/g, "") : null;

        // convertir "amueblado" en booleano
        const amueblado = req.body.amueblado === "No Amueblado" ? false : true;


    /* Asegúrate de que el usuario está autenticado
    const usuario_id = req.user?.id;
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }  */

    const usuario_id = 2;

    // Consulta SQL para insertar
    const query = `
      INSERT INTO inmuebles (
        usuario_id, tipo_inmueble, titulo, descripcion, hab, banos, metros_cuadrados,
        parqueos, ciudad, sector, precio, moneda, amueblado, inmueble
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      ) RETURNING id;
    `;

    // Ejecutar query
    const values = [
      usuario_id, tipo_inmueble, titulo, descripcion, hab, banos, metros_cuadrados,
      parqueos, ciudad, sector, precio, moneda, amueblado, inmueble
    ];

    const result = await db.query(query, values);
    const anuncio_id = result.rows[0].id;

    await guardarImagenes(anuncio_id, urls);

    // Redirige al anuncio
    res.redirect(`/anuncio/${anuncio_id}`);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});


// Endpoint para mostrar el anuncio por ID
anuncioRoutes.get('/:anuncio_id', (req, res) => {
  const { anuncio_id } = req.params; // Tomamos el ID de la URL

  // Aquí pondrías la lógica para buscar el anuncio en la base de datos
});



// funcion para guardar imagenes
async function guardarImagenes(ad_id, urls) {
  for (const url of urls) {
    try {
      const query = `
        INSERT INTO ad_images (ad_id, image_url)
        VALUES ($1, $2)
        RETURNING id;
      `;
      const values = [ad_id, url];

      const result = await db.query(query, values);
      console.log(`Imagen guardada con ID: ${result.rows[0].id}`);
    } catch (error) {
      console.error(`Error al guardar la imagen ${url}:`, error.message);
      // El loop sigue con la siguiente URL aunque haya error
    }
  }
}



export default anuncioRoutes;