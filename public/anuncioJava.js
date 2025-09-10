//Configuracion para comprimir imagenes
async function compressImage(file) {
  const options = {
    maxSizeMB: 1,           // máximo 1MB
    maxWidthOrHeight: 1280, // máximo ancho/alto
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

async function compressAllImages(files) {
  const compressed = [];
  for (let file of files) {
    const compressedFile = await compressImage(file);
    compressed.push(compressedFile);
  }
  return compressed;
}


async function loadCities() {
  try {
    const response = await fetch("/api/cities");
    const data = await response.json();

    // Variables globales
    cities = Object.keys(data);
    allLocation = data;

    // Select de ciudades
    const select = document.getElementById("citySelect");
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });

    // Evento: cuando cambie la ciudad seleccionada
    select.addEventListener("change", () => {
      console.log("Valor seleccionado:", select.value);

      const sectorSel = allLocation[select.value];
      console.log(sectorSel);

      // Select de sectores
      const sectorSelect = document.getElementById("sectorSelect");

      // Limpiar las opciones anteriores
      sectorSelect.innerHTML = '';

      // Agregar nuevas opciones
      sectorSel.forEach(sector => {
        const option = document.createElement("option");
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });
    });

  } catch (error) {
    console.error("Error al obtener ciudades:", error);
  }
}


loadCities();



//EVENT: Manejando click en el menu de celulares:

const toggleMenuBtn = document.getElementById("movil-menu-button");
const sidePanel = document.getElementById("sidePanel");

let isMenuOpen = false;

toggleMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // evita que el clic propague
  sidePanel.classList.toggle("hidden");
  isMenuOpen = !isMenuOpen;
  // Esperar un frame para que CSS registre el cambio de display
  requestAnimationFrame(() => {
    sidePanel.classList.toggle("visible");
  });

});

document.addEventListener("click", function (event) {

  // Verifica si el clic fue **afuera de divA**
  if (!sidePanel.contains(event.target) && isMenuOpen) {
    sidePanel.classList.toggle("hidden");
    isMenuOpen = false;
    // Esperar un frame para que CSS registre el cambio de display
    requestAnimationFrame(() => {
    sidePanel.classList.toggle("visible");
  });
  }
});
const segments = document.querySelectorAll('.segment');
let selectedType = "Todos";

  segments.forEach(btn => {
    btn.addEventListener('click', () => {
      segments.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.innerHTML;
      if (selectedType === "Compra") {
        selectedType = "venta";
      }; 
      //Esto es para lo que eligamos se vaya al input type-search para luego mandarlo en el form
      if (selectedType !== "Todos") {
        document.getElementById('type-search').setAttribute("value", selectedType.toLowerCase());
        const typeSearch = document.getElementById('type-search');
      };

    });
});



document.addEventListener("DOMContentLoaded", () => {
    function makeDivRedirect(divId, endpoint) {
        const div = document.getElementById(divId);
        if (!div) return console.error("No se encontró el div con ese ID");
        
        div.addEventListener("click", () => {
        window.location.href = endpoint; 
        console.log("working");
        });
    }

    // Usar la función
    makeDivRedirect("movil-nav-option-publish", "/anuncio/new");
});


// FUNCION-Control de botones tipo de anuncio venta o alquiler.


function twoButton(className) {
  // Asegúrate de que 'className' incluya el punto
  const buttons = document.querySelectorAll(`.${className}`);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Quita la clase 'active' de todos
      buttons.forEach(b => b.classList.remove('active'));
      // Agrega la clase 'active' al clicado
      btn.classList.add('active');

            // Obtener el input por su ID
        const input = document.getElementById(`${className}`);

        // Asignar el valor de la variable al input
        input.value = btn.innerHTML;

        console.log(input.value); // Para verificar que se asignó correctamente

    });
  });
}

// Llama a la función pasando solo el nombre de la clase sin el punto
twoButton("option-btn");
twoButton("moneda-btn");
twoButton("amueblado-btn");

// EVENT - Para que los precios tengan coma pero se guarden sin coma 


  const precioInput = document.getElementById("precioInput");

  precioInput.addEventListener("input", () => {
    // Guardar solo los números quitando cualquier coma
    let valorNumerico = precioInput.value.replace(/,/g, '');

    // Evitar que escriban letras
    if (isNaN(valorNumerico)) {
      valorNumerico = valorNumerico.replace(/[^\d]/g, '');
    }

    // Formatear con comas solo para mostrar
    const valorFormateado = Number(valorNumerico).toLocaleString('en-US');

    // Mostrar el valor formateado en el input
    precioInput.value = valorFormateado;
  });

  // Si quieres que al leer el valor en JavaScript obtengas solo números sin comas:
  function obtenerValorReal() {
    return precioInput.value.replace(/,/g, '');
  }

  //SUBIR IMAGENES Y PROYECTARLAS

  const inputArchivo = document.getElementById('archivo');
  const inputImagenes = document.getElementById('imagenes');
    const vistaPrevia = document.getElementById('vista-previa');
    const mensajeError = document.getElementById('mensaje-error');
    let totalImagenes = 0;
    const LIMITE_IMAGENES = 10;
    let filesArray = [];

    inputArchivo.addEventListener('change', () => {

      const archivos = Array.from(inputArchivo.files);
    
      
      if (totalImagenes + archivos.length > LIMITE_IMAGENES) {
        const disponibles = LIMITE_IMAGENES - totalImagenes;
        if (disponibles <= 0) {
          mensajeError.textContent = `Solo puedes subir un máximo de ${LIMITE_IMAGENES} imágenes.`;
          inputArchivo.value = "";
          return;
        } else {
          mensajeError.textContent = `Solo puedes subir un máximo de ${LIMITE_IMAGENES} imágenes.`;
          archivos.splice(disponibles); // cortar las extras
        }
      } else {
        mensajeError.textContent = "";
      }

      filesArray = filesArray.concat(archivos); 
      console.log(filesArray);

      archivos.forEach(archivo => {
        const url = URL.createObjectURL(archivo);
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Vista previa";
        vistaPrevia.appendChild(img);
        totalImagenes++;

      });


      inputArchivo.value = ""; // limpiar para permitir volver a elegir las mismas
    });

// Interceptar el submit del formulario
const form = document.querySelector(".formAnuncio");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envío normal

  const formData = new FormData(form);

  // Añadir las imágenes acumuladas
  filesArray.forEach(file => {
    formData.append("imagenes", file);
  });
  console.time("⏱️ fetch"); // inicia el cronómetro
  // Enviar con fetch
  fetch(form.action, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => { 
    console.log("✅ Respuesta servidor:", data);
    console.timeEnd("⏱️ fetch"); // mide cuánto tardó el request completo

  })
  .catch(err => console.error("❌ Error al enviar:", err));
});
