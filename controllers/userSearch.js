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


export const homeSearch = async (req, res) => {
  const { tipo_inmueble, inmueble, moneda, minPrecio, maxPrecio, ubicacion } = req.query;  // contains submitted form fields

  const valuesArray = [];
  let index = 1;

  let query = 'SELECT * FROM inmuebles WHERE 1=1 ';

    if (tipo_inmueble && tipo_inmueble !== "Todos") {
        valuesArray.push(tipo_inmueble);
        query += `AND tipo_inmueble ILIKE $${index++} `;
    }
    
    if (inmueble) {
        valuesArray.push(inmueble);
        query += `AND inmueble = $${index++} `;
    }
    
    if (minPrecio && maxPrecio) {
        valuesArray.push(moneda);
        query += `AND moneda = $${index++} `;
    } 

    if (minPrecio) {
        valuesArray.push(minPrecio);
        query += `AND precio >= $${index++} `;
    } 

    if (maxPrecio) {
        valuesArray.push(maxPrecio);
        query += `AND precio <= $${index++} `;
    }

    if (ubicacion[0]) {
        valuesArray.push(ubicacion[0]);
        query += `AND ciudad ILIKE $${index++} `;
    }

    if (ubicacion[1] && ubicacion[1] !== "Todos los sectores") {
        valuesArray.push(ubicacion[1]);
        query += `AND sector = $${index++} `;
    }
    console.log(valuesArray);
    console.log(query);

    try {
        const { rows } = await db.query(query, valuesArray);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
    

  res.send('Received form data:');
};