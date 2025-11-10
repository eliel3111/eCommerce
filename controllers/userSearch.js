import sectorsByCity from '../data/sectorsByCity_FULL.js';
import db from '../db.js';



//Example userController.js
export const getHome = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT tipo_inmueble, titulo, hab, banos, metros_cuadrados, ciudad, sector, precio, moneda, imagen FROM inmuebles WHERE destacado = true');
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


    try {
        const { rows } = await db.query(query, valuesArray);
    } catch (error) {
        console.error(error);
    }
    

  res.send('Received form data:');
};



export const searchPage = async (req, res) => {
  res.json(sectorsByCity);
};  


//Example userController.js
export const searchProperties = async (req, res) => {

  try {
    let {
  ordenar,
  tipo_inmueble,
  ciudad,
  sector,
  moneda,
  precio_min,
  precio_max,
  metros_min,
  metros_max,
  hab_min,
  hab_max,
  banos_min,
  banos_max,
  amueblado,
  offset = 0,
  inmueble
} = req.body;

 console.log("inmueble llega =" + moneda);

  // Convertir a número (si está vacío, queda null)
  precio_min = precio_min ? Number(precio_min) : null,
  precio_max = precio_max ? Number(precio_max) : null,
  metros_min = metros_min ? Number(metros_min) : null,
  metros_max = metros_max ? Number(metros_max) : null,
  hab_min = hab_min ? Number(hab_min) : null,
  hab_max = hab_max ? Number(hab_max) : null,
  banos_min = banos_min ? Number(banos_min) : null,
  banos_max = banos_max ? Number(banos_max) : null,

 amueblado = amueblado === "" ? null : amueblado === "true";



  // Convertir a número siempre
  offset = Number(offset) || 0


console.log({
  ordenar,
  tipo_inmueble,
  ciudad,
  sector,
  moneda,
  precio_min: req.body.precio_min,
  precio_max: req.body.precio_max,
  metros_min: req.body.metros_min,
  metros_max: req.body.metros_max,
  hab_min: req.body.hab_min,
  hab_max: req.body.hab_max,
  banos_min: req.body.banos_min,
  banos_max: req.body.banos_max,
  amueblado,
  inmueble,
  offset
});



    const filtros = [];
    const valores = [];

    // === FILTROS DINÁMICOS ===
    if (tipo_inmueble) {
      valores.push(tipo_inmueble);
      filtros.push(`tipo_inmueble = $${valores.length}`);
    }

    if (inmueble) {
      console.log("inmueble llega =" + inmueble);
      valores.push(inmueble.trim());
      filtros.push(`TRIM(inmueble) = $${valores.length}`);
    }

    // === FILTRO CIUDAD / SECTOR ===
    if (sector) {
      valores.push(sector.trim());
      filtros.push(`TRIM(sector) = $${valores.length}`);
    } else if (ciudad) {
      valores.push(ciudad.trim());
      filtros.push(`TRIM(ciudad) = $${valores.length}`);
    }



    if (amueblado !== null && amueblado !== "") {
      // Convertir correctamente a boolean
      const isAmueblado = amueblado === true || amueblado === "true";

      valores.push(isAmueblado);
      filtros.push(`amueblado = $${valores.length}`);
    }



  // 🧩 Función para generar un filtro de rango de precios dinámico
function agregarFiltroRango(moneda, min, max) {
  // Si no hay moneda ni rango, no hace nada
  if (!moneda && !min && !max) return null;

  let filtro = "";
  
  if (moneda) {
    valores.push(moneda);
    filtro += `moneda = $${valores.length}`;
  }

  if (min && max) {
    valores.push(min, max);
    filtro += (filtro ? " AND " : "") + `precio BETWEEN $${valores.length - 1} AND $${valores.length}`;
  } else if (min) {
    valores.push(min);
    filtro += (filtro ? " AND " : "") + `precio >= $${valores.length}`;
  } else if (max) {
    valores.push(max);
    filtro += (filtro ? " AND " : "") + `precio <= $${valores.length}`;
  }

  return filtro ? `(${filtro})` : null;
}


// === 💰 MONEDA Y RANGO DE PRECIO ===
let filtroMoneda = null;

if (!moneda || moneda === "$RD") {
  let filtroRD
  if (!moneda && !precio_min && !precio_max) {
    console.log("No hay Moneda");  
  } else {
    // Filtro principal RD$
    filtroRD = agregarFiltroRango("$RD", precio_min, precio_max);
  }
  

  let filtroUSD = null;

  // Solo ejecutar si hay algún precio definido
  if (precio_min || precio_max) {
    const minUSD = precio_min ? Math.round(precio_min / 60) : null;
    const maxUSD = precio_max ? Math.round(precio_max / 60) : null;
    filtroUSD = agregarFiltroRango("$US", minUSD, maxUSD);
  }


  // 🔹 Combinar con OR si ambos existen
  if (filtroRD && filtroUSD) {
    filtroMoneda = `(${filtroRD} OR ${filtroUSD})`;
  } else {
    filtroMoneda = filtroRD || filtroUSD;
  }

} else if (moneda === "$US") {
  // Filtro principal US$
  console.log("MONEDA llega =" + moneda);
  const filtroUS = agregarFiltroRango("$US", precio_min, precio_max);
  
  let filtroRD = null;

// Solo ejecutar si hay algún precio definido
if (precio_min || precio_max) {
  const minRD = precio_min ? Math.round(precio_min * 60) : null;
  const maxRD = precio_max ? Math.round(precio_max * 60) : null;
  filtroRD = agregarFiltroRango("$RD", minRD, maxRD);
}

  // 🔹 Combinar con OR si ambos existen
  if (filtroUS && filtroRD) {
    filtroMoneda = `(${filtroUS} OR ${filtroRD})`;
  } else {
    filtroMoneda = filtroUS || filtroRD;
  }
}

// ✅ Agregar el filtro final al array de filtros
if (filtroMoneda) filtros.push(filtroMoneda);



    // === RANGO METROS ===
    if (metros_min && metros_max) {
      valores.push(metros_min, metros_max);
      filtros.push(`metros_cuadrados BETWEEN $${valores.length - 1} AND $${valores.length}`);
    } else if (metros_min) {
      valores.push(metros_min);
      filtros.push(`metros_cuadrados >= $${valores.length}`);
    } else if (metros_max) {
      valores.push(metros_max);
      filtros.push(`metros_cuadrados <= $${valores.length}`);
    }

    // === RANGO HABITACIONES ===
    if (hab_min && hab_max) {
      valores.push(hab_min, hab_max);
      filtros.push(`hab BETWEEN $${valores.length - 1} AND $${valores.length}`);
    } else if (hab_min) {
      valores.push(hab_min);
      filtros.push(`hab >= $${valores.length}`);
    } else if (hab_max) {
      valores.push(hab_max);
      filtros.push(`hab <= $${valores.length}`);
    }

    // === RANGO BAÑOS ===
    if (banos_min && banos_max) {
      valores.push(banos_min, banos_max);
      filtros.push(`banos BETWEEN $${valores.length - 1} AND $${valores.length}`);
    } else if (banos_min) {
      valores.push(banos_min);
      filtros.push(`banos >= $${valores.length}`);
    } else if (banos_max) {
      valores.push(banos_max);
      filtros.push(`banos <= $${valores.length}`);
    }

    // === ORDEN DE RESULTADOS ===
    let orderBy = "ORDER BY id DESC"; // default: más nuevos primero

    switch (ordenar) {
      case "viejo":
        orderBy = "ORDER BY id ASC";
        break;
      case "precio_bajo":
        orderBy = "ORDER BY precio ASC";
        break;
      case "precio_alto":
        orderBy = "ORDER BY precio DESC";
        break;
      default:
        orderBy = "ORDER BY id DESC";
    }
    
    const limit = 26;
    const offsetValue = parseInt(offset, 10) || 0;

    // === QUERY PRINCIPAL ===
    let queryBase = "SELECT * FROM inmuebles";
    if (filtros.length > 0) {
      queryBase += " WHERE " + filtros.join(" AND ");
    }

    queryBase += ` ${orderBy} LIMIT ${limit} OFFSET ${offsetValue}`;
    console.log(filtros);
    console.log(valores);
    console.log(queryBase);
    const result = await db.query(queryBase, valores);
    console.log(result.rows);
    let anuncios = result.rows;
    let destacados = [];

    // también buscar destacados aleatorios
      const destacadosQuery = `
        SELECT * FROM inmuebles
        WHERE destacado = true
        ORDER BY RANDOM()
        LIMIT 4;
      `;
      const destacadosResult = await db.query(destacadosQuery);
      destacados = destacadosResult.rows;

    // === FILTROS ACTIVOS PARA DEVOLVER AL FRONT ===
    const currentFilters = {
      ordenar,
      tipo_inmueble,
      ciudad,
      sector,
      moneda,
      precio_min,
      precio_max,
      metros_min,
      metros_max,
      hab_min,
      hab_max,
      banos_min,
      banos_max,
      amueblado,
      inmueble,   // 👈 incluir aquí
      offset: offsetValue
    };


    // === RESPUESTA FINAL ===
    // 👇 renderiza la vista EJS con los datos
    res.render("search-properties.ejs", {
      anuncios,
      destacados,
      currentFilters
    });
  } catch (error) {
    console.error("Error en /buscar:", error);
    res.status(500).send("Error interno en la búsqueda");
  }


};