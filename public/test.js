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
console.log(segments);
  segments.forEach(btn => {
    btn.addEventListener('click', () => {
      segments.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.innerHTML;

      //Esto es para lo que eligamos se vaya al input type-search para luego mandarlo en el form
      document.getElementById('type-search').setAttribute("value", selectedType);
      const typeSearch = document.getElementById('type-search');
      console.log("El usuario quiere buscar una propiedad tipo: " + selectedType);
    });
});

// MANEJANDO CLICK EN EL BOTON DE BUSQUEDA DE TIPO DE PROPIEDAD

  const btn = document.getElementById('tooltipBtn');
  const tooltipType = document.getElementById('tooltipType');
  handleTooltip(btn, tooltipType);

// MANEJANDO CLICK EN EL BOTON DE BUSQUEDA DE "PRECIO" DE PROPIEDAD--------

  const btnPrice = document.getElementById('tooltipBtnPrice');
  const tooltipPrice = document.getElementById('tooltipPrice');
  handleTooltip(btnPrice, tooltipPrice);

// MANEJANDO SELECCION DE MODENA------------------------------------
  // Obtener referencias a los elementos del DOM
  const priceRd = document.getElementById('toolPriceRd');
  const priceUsa = document.getElementById('toolPriceUsa');
  const inputCurrency = document.getElementById('moneda-busqueda');
  // Asignar eventos de clic para manejar la selección de moneda
  priceRd.addEventListener("click", () => {
    handleCurrency(priceRd, "RD");
  });
  priceUsa.addEventListener("click", () => {
    handleCurrency(priceUsa, "USA");
  });

// MANEJANDO INPUT EVENT------------------------------------
  //Obtener input min and max.
  const inputMin = document.getElementById('inputMin');
  const inputMax = document.getElementById('inputMax');
  //Variables para guardar grango de precio de busqueda
  let valueMin = 0;
  let valueMax = 0;

  formatearInput(inputMin, "A");
  formatearInput(inputMax, "B");

// MANEJANDO CLEAR BOTON--------------------------------------

  const clearButton = document.getElementById('toolPriceClear');

  clearButton.addEventListener('click', () => {
    inputMin.value = "";
    inputMax.value = "";
  });

// LLAMANDO funcion para igual input Maximo menor a Minino y se igualen.
  HandleWrongMax(inputMin, inputMax);

// MANEJANDO "SAVE" BOTON--------------------------------------

  const priceSaveButton = document.getElementById('toolPriceSave');
  const formMinPrice = document.getElementById('min-precio-busqueda');
  const formMaxPrice = document.getElementById('max-precio-busqueda');
  

  priceSaveButton.addEventListener('click', () => {
    formMinPrice.value = valueMin;
    formMaxPrice.value = valueMax;
    const tooltipPrice = document.getElementById('tooltipPrice');

    //Para que el valor del presio se ponga en la span paguina principal
    const spanPrices = document.getElementById('spanPrecio');
    spanPrices.innerText = valueMin + " - " + valueMax;

    if (inputMin.value !== "" || inputMax.value !== "") {
      setTimeout(() => {
      tooltipPrice.style.display = 'none';
      }, 50);
    };
  });

// MANEJANDO "LOCATION" MODAL--------------------------------------

// Obtener los elementos
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const containerSector = document.getElementById('containerSector');

    // Event listener para abrir el modal
    openModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'flex'; // Mostrar el modal centrado
    });

    // Event listener para cerrar el modal
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none'; // Ocultar el modal
      console.log("Modal Boton Cerrar");
      //Para que aparezca el container de los sectores
      closingInputCiudad();
      closingInputSector();
    });

    // También puedes cerrar el modal si haces clic fuera del contenido
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        console.log("Click Afuera del Modal");
        //Para que aparezca el container de los sectores
        closingInputCiudad();
        closingInputSector();
      };
    });

// MANEJANDO "LOCATION" City Input--------------------------------------

    const divA = document.getElementById("divA");
    const containerCity = document.getElementById("containerCity");

    let cities = []; 
    let allLocation = {}; // aquí se guardarán los datos
    let citySelected = "";



    //Variable control para saber si el input para filtrar las ciudad
    //esta creado o no
    let inputCreated = false;
    let sectorCreated = false;

//EVENT: para cuando le de click a seleccionar ciudad, Se crea
// un input, una lista con ciudades.
    divA.addEventListener("click", () => {
      if (inputCreated) {
        inputCreated = false;
        const inputCity = document.getElementById("cityInput");
        const listCity = document.getElementById("cityList");
        //Para que aparezca el container de los sectores
        containerSector.style.display = 'block';
        if (inputCity) {
          inputCity.remove(); // elimina directamente el elemento
          listCity.remove();
        };
        return;
      };
      sectorCreated ? closingInputSector() : null;
      //Para eliminar el container de los sectores
      containerSector.style.display = 'none';
      

      const input = document.createElement("input");
      input.type = "text";
      input.id = "cityInput";
      containerCity.appendChild(input);

      setTimeout(() => {
        input.focus();
        }, 100);
      

      const ul = document.createElement("ul");
      ul.id = "cityList";

      //agregar ciudades
      cities.forEach((city, index) => {
        const li = document.createElement("li");
        li.textContent = city;
        li.className = "ciudades-busqueda";
        li.id = "ciudad" + index;
        ul.appendChild(li);
        });

      containerCity.appendChild(ul);
      inputCreated = true;

      //event listener para filtrar
        input.addEventListener("input", () => {
          const filterText = input.value.trim().toLowerCase();
        
              const listItems = ul.querySelectorAll("li");
              listItems.forEach(item => {
                let itemFiltered = item.innerText.toLowerCase();
                if (itemFiltered.includes(filterText) || filterText === "") {
                  item.style.display = "block";
                } else {
                  item.style.display = "none";
                }
              });
        });


    //EVENT: Click a seleccionar ciudad, Se optiene el elemento de la lista
    // seleccionado.
        const citiesList = document.getElementById("cityList");
        citiesList.addEventListener("click", (e) => {

          if (e.target.classList.contains("ciudades-busqueda")) {
            const formCity = document.getElementById("ciudad-busqueda");
            formCity.value = e.target.innerText;
            citySelected = e.target.innerText;
            closingInputCiudad();
            const selectCity = document.getElementById("cityButton");
            selectCity.innerText = e.target.innerText;
          };

        });
    });


//EVENT: Sector

    const divB = document.getElementById("divB");
    const sectorContainer = document.getElementById("containerSector");

    //let cities = []; // aquí se guardarán los datos
    let sectorSelected = "";
    let sectors = []; // aquí se guardarán los sectores
    


    divB.addEventListener("click", () => {
      if (sectorCreated) {
        sectorCreated = false;
        const inputCity = document.getElementById("sectorInput");
        const listCity = document.getElementById("sectorList");
        //Para que aparezca el container de los sectores

        if (inputCity) {
          inputCity.remove(); // elimina directamente el elemento
          listCity.remove();
        };
        return;
      };


      const sectorSel = allLocation[citySelected];

      if (sectorSel) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "sectorInput";
      sectorContainer.appendChild(input);

      setTimeout(() => {
        input.focus();
        }, 100);
      

      const ul = document.createElement("ul");
      ul.id = "sectorList";

      //agregar ciudades
      sectorSel.forEach((city, index) => {
        const li = document.createElement("li");
        li.textContent = city;
        li.className = "ciudades-busqueda";
        li.id = "ciudad" + index;
        ul.appendChild(li);
        });

      sectorContainer.appendChild(ul);
      sectorCreated = true;

            //event listener para filtrar
        input.addEventListener("input", () => {
          const filterText = input.value.trim().toLowerCase();
        
              const listItems = ul.querySelectorAll("li");
              listItems.forEach(item => {
                let itemFiltered = item.innerText.toLowerCase();
                if (itemFiltered.includes(filterText) || filterText === "") {
                  item.style.display = "block";
                } else {
                  item.style.display = "none";
                }
              });
        });

        //EVENT: Click a seleccionar ciudad, Se optiene el elemento de la lista
    // seleccionado.
        const citiesList = document.getElementById("sectorList");
        citiesList.addEventListener("click", (e) => {

          if (e.target.classList.contains("ciudades-busqueda")) {
            const formCity = document.getElementById("sector-busqueda");
            formCity.value = e.target.innerText;
            sectorSelected = e.target.innerText;
            closingInputSector()
            const selectCity = document.getElementById("sectorButton");
            selectCity.innerText = e.target.innerText;
          };

        });
    } else {
      console.log(false);
    };
      




    
    });









/* FUNCTION: to create a tooltip that accepts two values: a button and the tooltip. 
   First, you need to find the document element by its ID. */
function handleTooltip(btn, tooltip) {
let mouseInside = false;
let entered;

// Mostrar tooltip al hacer clic
btn.addEventListener('click', () => {
  tooltip.style.display = 'block';
});

// Marcar si el mouse está dentro del botón o del tooltip
function setInside(value) {
  mouseInside = value;
  if (!mouseInside) {
    tooltip.style.display = 'none';
  }
}

btn.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!tooltip.matches(':hover') && entered === true) {
      setInside(false);
      entered = false;
    }
  },500);
});

tooltip.addEventListener('mouseenter', () => {
  mouseInside = true;
  entered = true;
});

btn.addEventListener('mouseenter', () => {
  mouseInside = true;
});

tooltip.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!btn.matches(':hover') && entered === true) {
      setInside(false);
      entered = false;
    }
  }, 800);
});

// Only if the tooltip clicked is the inmuebles type is going to close
tooltip.addEventListener('click', () => {
  if (btn.id === "tooltipBtn") {
    setTimeout(() => {
    if (entered === true) {
      setInside(false);
      entered = false;
      console.log(btn.id);
    }
  }, 10);
  } else {
    return;
  };
});

};


// FUNCTION: Updates the hidden input and display label based on the selected property type, truncating text if too long.
function handleTypeTool(id) {
  // Get the selected text from the clicked element
  let selected = document.getElementById(id).innerText;

  // Set the value of the hidden input for search
  document.getElementById('tipo-inmueble-busqueda').value = selected;

  // Truncate the label if it's too long
  if (selected.length > 12) {
    selected = selected.substring(0, 9) + "...";
  }

  // Update the visible span element with truncated text
  const typeInmueble = document.querySelectorAll(".span-inmuebles")
  typeInmueble[0].innerText = selected;

};


// FUNCTION: 

function handleCurrency(elementHtml, valor) {
  //se le borra la selected class a ambos div
  priceRd.classList.remove("tool-price-moneda-selected");
  priceUsa.classList.remove("tool-price-moneda-selected");
  //se le pone la class al div que se pasa como paramentro
  elementHtml.classList.add("tool-price-moneda-selected");

  // se le pone el value de parametro como input value
  inputCurrency.value = valor;
};


// FUNCTION: Que crea un evento en el input de precio para
// que agrege comas.

function formatearInput(input, setValor) {
    input.addEventListener('input', () => {
      // Quitar comas y todo lo que no sea número
      const valorSinFormato = input.value.replace(/[^\d]/g, '');

      // Convertir a número
      const numero = parseInt(valorSinFormato || '0', 10);

      // Guardar en variable
      if (setValor === "A") {
        valueMin = numero;
      } else if (setValor === "B" && numero < valueMin) {
        valueMax = valueMin;
      } else {
        valueMax = numero;
      };

      console.log("Precio minimo: " + valueMin + " Precio Maximo: " + valueMax);
      // Mostrar con comas
      input.value = numero.toLocaleString('en-US');
      
    });
  }

  // FUNCTION: Para que si usuario pone un valor Maximo menor ----------
  // a vamor Minimo, este se iguale.

  function HandleWrongMax(inputMin, inputMax) {
  inputMax.addEventListener("blur", function () {

  // Quitar comas y todo lo que no sea número
  const valorSinFormatoA = inputMin.value.replace(/[^\d]/g, '');
  const valorSinFormatoB = inputMax.value.replace(/[^\d]/g, '');

  const valueA = parseInt(valorSinFormatoA || '0', 10);
  const valueB = parseInt(valorSinFormatoB || '0', 10);

  if (!isNaN(valueA) && !isNaN(valueB) && valueB < valueA) {
    inputMax.value = valueA.toLocaleString('en-US');
  };
});
};

//FUNCTION: para saber si el input "Seleccionar Ciudad"
//esta creado y de ser asi cerrar el input.

  function closingInputCiudad() {
    containerSector.style.display = 'block';
    if (inputCreated) {
        inputCreated = false;
        const inputCity = document.getElementById("cityInput");
        const listCity = document.getElementById("cityList");
        if (inputCity) {
          inputCity.remove(); // elimina directamente el elemento
          listCity.remove();
        };
        return;
        };
  };

  function closingInputSector() {
    containerSector.style.display = 'block';
    if (sectorCreated) {
        sectorCreated = false;
        const inputCity = document.getElementById("sectorInput");
        const listCity = document.getElementById("sectorList");
        if (inputCity) {
          inputCity.remove(); // elimina directamente el elemento
          listCity.remove();
        };
        return;
        };
  };



  async function loadCities() {
  try {
    const response = await fetch("/api/cities");
    const data = await response.json();

    cities = Object.keys(data);
    allLocation = data;

    console.log("Todo cargado:", allLocation);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
  }
}