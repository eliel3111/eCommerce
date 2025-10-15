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


async function getAnuncioById(req, res) {
  const id = req.params.id;
  const usuarioId = req.user ? req.user.id : null;
 // el usuario autenticado 
  
  console.log(usuarioId);
  console.log(id);

  const existe = await db.query(
    'SELECT 1 FROM favoritos WHERE user_id = $1 AND producto_id = $2',
    [usuarioId, id]
  );

  

  // 🔹 Validar que el ID sea un número y no esté vacío
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // 🔹 Buscar el anuncio en la base de datos
    const anuncioResult = await db.query(
        "SELECT * FROM inmuebles WHERE id = $1",
        [id]
    );
    
    if (anuncioResult.rows.length === 0) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    // Guardar anuncio en constante ANUNCIO
    const anuncioDetalles = anuncioResult.rows[0];
    console.log(anuncioDetalles.usuario_id);
    // 🔹 Buscar imágenes relacionadas
    const imagenesResult = await db.query(
      "SELECT id, image_url FROM ad_images WHERE ad_id = $1",
      [id]
    );
    if (imagenesResult.rows.length !== 0) {
    // Guardar imágenes en ANUNCIO.imagenes
    anuncioDetalles.imagenes = imagenesResult.rows;
    }

    // Agregar si esta en favorito 
    if (existe.rows.length > 0) {
    // Ya existe la relación
    console.log({ message: 'El anuncio ya está en favoritos.' });
        anuncioDetalles.favoritos = true;
    } else {
        anuncioDetalles.favoritos = false;
    }
    

    //BUSCAR USUARIO QUE PUBLICO ANUNCIO
     try {
    // Consulta a la base de datos
    const query = `
      SELECT nombre, telefono 
      FROM usuarios 
      WHERE id = $1
      LIMIT 1
    `;
    const values = [anuncioDetalles.usuario_id];

    const { rows } = await db.query(query, values);

    if (rows.length > 0) {
      // Si hay resultado, lo agregas al objeto
      anuncioDetalles.usuario = rows[0];
    } else {
      // Si no existe el usuario
      anuncioDetalles.usuario = null;
    }

  } catch (error) {
    console.error('Error al obtener usuario:', error);
  }

    // 🔹 Enviar respuesta al frontend
    console.log("Rendering anuncioTerminado with:", anuncioDetalles);
    console.log(req.user);
    res.render("anuncioTerminado", { anuncio: anuncioDetalles });
  } catch (error) {
    console.error("Error en getAnuncioById:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export { getAnuncioById };