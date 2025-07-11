import sectorsByCity from '../data/sectorsByCity_FULL.js';
import db from '../db.js';

//Example userController.js
export const getHome = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT tipo_inmueble, titulo, hab, banos, metros_cuadrados, ciudad, sector, precio, moneda, imagen FROM inmuebles WHERE destacado = true');
    console.log(rows);
    res.render("home.ejs", { content: rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener inmuebles' });
  }
};

export const getCities = async (req, res) => {
  res.json(sectorsByCity);
};  
