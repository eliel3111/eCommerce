console.log(anuncio);

async function loadCities() {
  try {
    const response = await fetch("/api/cities");
    const data = await response.json();

    // Variables globales
    const cities = Object.keys(data);
    const allLocation = data;

    // Select de ciudades
    const selectCiudad = document.getElementById("citySelect");

    // Agregar opciones de ciudad
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      selectCiudad.appendChild(option);
    });

    // Preseleccionar ciudad (anuncio.ciudad)
    const ciudadPreseleccionada = anuncio.ciudad || "";
    if ([...selectCiudad.options].some(opt => opt.value === ciudadPreseleccionada)) {
      selectCiudad.value = ciudadPreseleccionada;
    }

    // Función para actualizar sectores según ciudad
    const actualizarSectores = (ciudad) => {
      const sectorSelect = document.getElementById("sectorSelect");

      // Limpiar opciones anteriores
      sectorSelect.innerHTML = '';

      const sectores = allLocation[ciudad] || [];

      // Agregar nuevas opciones
      sectores.forEach(sector => {
        const option = document.createElement("option");
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });

      // Preseleccionar sector usando anuncio.sector
      const sectorPreseleccionado = anuncio.sector || "";
      if ([...sectorSelect.options].some(opt => opt.value === sectorPreseleccionado)) {
        sectorSelect.value = sectorPreseleccionado;
      }

      // Disparar evento 'change' para listeners
      sectorSelect.dispatchEvent(new Event('change'));
    };

    // Evento cambio ciudad
    selectCiudad.addEventListener("change", () => {
      console.log("Ciudad seleccionada:", selectCiudad.value);
      actualizarSectores(selectCiudad.value);
    });

    // Llamada inicial para preseleccionar sectores de la ciudad
    if (ciudadPreseleccionada) {
      actualizarSectores(ciudadPreseleccionada);
    }

    // Disparar evento 'change' en ciudad para que cualquier listener se active
    selectCiudad.dispatchEvent(new Event('change'));

  } catch (error) {
    console.error("Error al obtener ciudades:", error);
  }
}

loadCities();

//AQUI CARGAMOS TODOS LOS VALORES DEL ANUNCIO---------------------------------

function activarBotonPorTexto(selector, valor) {
  const botones = document.querySelectorAll(`.${selector}`);
  const input = document.getElementById(selector);

  botones.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === valor.toLowerCase()) {
      // Activa el botón
      btn.classList.add("active");

      // Dispara el evento click asociado
      btn.click();
      const texto = btn.textContent.trim();
const valorFinal = texto === "Amueblado" 
  ? true 
  : texto === "No Amueblado" 
    ? false 
    : texto;

input.value = valorFinal;

    } else {
      // Desactiva los demás
      btn.classList.remove("active");
    }
  });
}


// Ejemplos:
activarBotonPorTexto("option-btn", anuncio.tipo_inmueble);
activarBotonPorTexto("moneda-btn", anuncio.moneda);

const estadoAmueblado = anuncio.amueblado ? "Amueblado" : "No Amueblado";
activarBotonPorTexto("amueblado-btn", estadoAmueblado);

// Función para seleccionar el valor correcto en un <select> según el name
function setSelectValue(name, value) {
  const select = document.querySelector(`select[name="${name}"]`);
  if (select) {
    select.value = value; // Establece el valor seleccionado
  }
}

// Ejemplo: asignar los valores desde anuncio
setSelectValue("hab", anuncio.hab);
setSelectValue("banos", anuncio.banos);
setSelectValue("parqueos", anuncio.parqueos);


// Llenar los inputs con los datos del anuncio
document.querySelector('input[name="titulo"]').value = anuncio.titulo || "";
document.querySelector('textarea[name="descripcion"]').value = anuncio.descripcion || "";
document.querySelector('input[name="precio"]').value = anuncio.precio || "";
document.querySelector('input[name="metros_cuadrados"]').value = anuncio.metros_cuadrados || "";

// 🔥 Dispara el evento 'input' en cada uno (para activar listeners, autoajuste, etc.)
["titulo", "descripcion", "precio", "metros_cuadrados"].forEach(name => {
  const element = document.querySelector(`[name="${name}"]`);
  if (element) {
    element.dispatchEvent(new Event("input"));
  }
});


// Obtener el select
const selectInmueble = document.getElementById("clase-inmueble");

// Asignar el valor desde anuncio
if (selectInmueble && anuncio.inmueble) {
  // Buscar si la opción existe (para evitar errores si el texto no coincide exactamente)
  const opciones = Array.from(selectInmueble.options);
  const opcionEncontrada = opciones.find(opt => opt.value === anuncio.inmueble || opt.text === anuncio.inmueble);

  if (opcionEncontrada) {
    selectInmueble.value = opcionEncontrada.value;
  }

  // 🔥 Activar evento (por si hay listeners que dependan de ello)
  selectInmueble.dispatchEvent(new Event("change"));
}







//EVENTS DE LOS CAMBIOS-------------------------------------------
function activarBotones(claseBotones, idInput) {
  const botones = document.querySelectorAll(`.${claseBotones}`);
  const input = document.getElementById(idInput);

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Quitar la clase 'active' de todos los botones
      botones.forEach(b => b.classList.remove('active'));

      // Agregar la clase 'active' solo al botón clicado
      boton.classList.add('active');

      // Obtener el valor del texto del botón
      let valor = boton.textContent.trim();

      // Si el botón está dentro de un contenedor con clase 'option-group',
      // convierte el valor a minúsculas
      if (boton.closest('.option-group')) {
        valor = valor.toLowerCase();
      }

      // Asignar el valor al input oculto
      input.value = valor;

      // (Opcional) Mostrar en consola para verificar
      console.log(`Valor asignado (${idInput}):`, input.value);
    });
  });
}


// Llamas la función para los botones de moneda
activarBotones('moneda-btn', 'moneda-btn');
activarBotones('option-btn', 'option-btn');



// Selecciona todos los elementos con la clase 'amueblado-btn'
const botonesAmueblado = document.querySelectorAll('.amueblado-btn');

// Selecciona el input oculto donde se guardará el valor (true/false)
const inputAmueblado = document.getElementById('amueblado-btn');

// Recorre cada botón para agregarle un evento de clic
botonesAmueblado.forEach(boton => {
  boton.addEventListener('click', () => {

    // 🔹 Quita la clase 'active' de todos los botones
    // Esto asegura que solo uno esté activo visualmente
    botonesAmueblado.forEach(b => b.classList.remove('active'));

    // 🔹 Agrega la clase 'active' al botón que fue clicado
    boton.classList.add('active');

    // 🔹 Determina el valor a guardar en el input
    // Si el texto del botón es "Amueblado", el valor será true
    // Si no (por ejemplo, "No Amueblado"), será false
    const valor = boton.textContent.trim().toLowerCase() === 'amueblado';

    // 🔹 Guarda el valor en el input oculto
    // ⚠️ Nota: se guarda como texto ("true" o "false")
    // Si necesitas un booleano real en JavaScript, usa JSON.parse(inputAmueblado.value)
    inputAmueblado.value = valor;

    // 🔹 Muestra en consola el valor actual (opcional, para verificar)
    console.log('Valor de amueblado:', inputAmueblado.value);
  });
});




const precioInput = document.getElementById("precioInput");

// Mostrar el número con comas mientras se escribe
precioInput.addEventListener("input", (e) => {
  let valor = e.target.value.replace(/\D/g, ""); // Solo números
  e.target.value = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Mostrar formateado
});

// Antes de enviar el formulario, quitar las comas
const form = precioInput.closest("form"); // obtiene el formulario que contiene el input
if (form) {
  form.addEventListener("submit", () => {
    precioInput.value = precioInput.value.replace(/,/g, ""); // quitar comas al enviar
  });
}




