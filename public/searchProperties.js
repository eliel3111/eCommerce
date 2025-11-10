console.log(currentFilters);
console.log(anuncios);
  // Variables globales
  let cities = [];
  let allLocation = {};
  let citySelected = "";
  let sectorSelected = "";
  let inputCreated = false;
  let sectorCreated = false;
  let chipsActivos = []; //Poner chips de los filtros que llegan del back end.


if (currentFilters && typeof currentFilters === "object") {
    filtrosVisibles = Object.keys(currentFilters).filter(key => {
      const value = currentFilters[key];
      // Ignorar si la clave es "offset" o si el valor es null o vacío
      return key !== "offset" && value !== null && value !== "";
    });
  }
    if (filtrosVisibles.length > 0) { 
        console.log("Se recibieron filtros")

        if (currentFilters?.tipo_inmueble) {
            aplicarFiltro(
                "tipo_inmueble",     // id del input
                "tipo-inmueble",     // id del contenedor de botones
                "btn-pill",          // clase de los botones
                currentFilters.tipo_inmueble // valor actual del filtro
            );
            const tipo = currentFilters.tipo_inmueble.toLowerCase().trim();

            if (tipo === "venta" || tipo === "alquiler") {
              
              // Crear texto del chip
              const textoChip = `Inmuebles en ${tipo}`;

              // Crear el div visual del chip
              const chipHTML = `<div class="filter-chip"  data-id="tipo_inmueble">
              ${textoChip}
              <svg class="chip-close" id="fi_2976286" enable-background="new 0 0 320.591 320.591"
                    height="12" width="12" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
                    <g id="close_1_">
                      <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
                      <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
                    </g>
                  </svg>
              </div>`;

              // Crear el objeto para el array global
              const chipObj = {
                key: "tipo_inmueble",
                value: chipHTML
              };

              // Guardarlo en el array global
              chipsActivos.push(chipObj);

              console.log("✅ Chip añadido:", chipObj);
            }
        }




        if (currentFilters?.inmueble) {
            aplicarFiltro(
                "categoria",     // id del input
                "categoria-inmueble",     // id del contenedor de botones
                "chip",          // clase de los botones
                currentFilters.inmueble // valor actual del filtro
            );

            const valor = currentFilters.inmueble.trim();

            // Lista de valores válidos
            const categoriasValidas = [
              "Apartamentos",
              "Casas",
              "Casas Vacacionales y Villas",
              "Locales y Oficinas",
              "Solares",
              "Penthouses",
              "Otros"
            ];

            // Verificar si el valor está dentro de la lista
            if (categoriasValidas.includes(valor)) {
              // Crear HTML del chip
              const chipHTML = `
                <div class="filter-chip" data-id="categoria">
                  ${valor}
                  <svg class="chip-close" id="fi_2976286" enable-background="new 0 0 320.591 320.591"
                    height="12" width="12" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
                    <g id="close_1_">
                      <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
                      <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
                    </g>
                  </svg>
                </div>
              `;

              // Crear objeto del chip
              const chipObj = {
                key: "inmueble",
                value: chipHTML
              };

              // Agregar al array global
              chipsActivos.push(chipObj);

              console.log("🏷️ Chip agregado:", chipObj);
              console.log("📦 chipsActivos:", chipsActivos);
            } else {
              console.warn(`⚠️ Valor '${valor}' no es una categoría válida.`);
            }

        }

        if (currentFilters?.moneda) {
            aplicarFiltro(
                "moneda",     // id del input
                "moneda-inmueble",     // id del contenedor de botones
                "btn-pill",          // clase de los botones
                currentFilters.moneda // valor actual del filtro
            );

            // ---- Lógica para crear chip de "moneda" ----
          if (currentFilters?.moneda) {
            const valor = currentFilters.moneda.toUpperCase(); // Aseguramos que esté en mayúsculas

            // Solo continuar si es "$US" o "$RD"
            if (valor === "$US" || valor === "$RD") {
              // Crear el chip HTML
              const chipHTML = `
                <div class="filter-chip" data-id="moneda">
                  ${valor}
                  <svg class="chip-close" id="fi_2976286" enable-background="new 0 0 320.591 320.591"
                    height="12" width="12" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
                    <g id="close_1_">
                      <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
                      <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
                    </g>
                  </svg>
                </div>
              `;

              // Crear el objeto y guardarlo en el array global
              const chipObj = {
                key: "moneda",
                value: chipHTML
              };

              chipsActivos.push(chipObj);

              console.log("💵 Chip agregado:", chipObj);
              console.log("📦 chipsActivos:", chipsActivos);
            } else {
              console.warn(`⚠️ Valor '${valor}' no es una moneda válida ("$US" o "$RD").`);
            }
          }
        }

        if (typeof currentFilters?.amueblado === "boolean") {
            const input = document.getElementById("amueblado");
            const botones = document.querySelectorAll(`#amueblado-inmueble .btn-pill`);
            
            // ✅ Asignar valor al input si existe
            if (input) {
                input.value = currentFilters.amueblado;
            } else {
                console.warn(`⚠️ No se encontró el elemento con id 'amueblado`);
            }

            // ✅ Quitar 'is-active' de todos y activar el que coincide
            botones.forEach(btn => {
                btn.classList.remove("is-active");
                
                const valorBtn = btn.dataset.value === "true" ? true : false;
                if (valorBtn == currentFilters.amueblado) {
                btn.classList.add("is-active");
                }
            });
        }

        if (currentFilters?.ciudad || currentFilters?.sector) {
            // Obtener los elementos del DOM solo una vez
            const spanUbicacion = document.querySelector(".span-inmuebles-ubicacion");
            const inputCiudad = document.getElementById("ciudad-busqueda");
            const inputSector = document.getElementById("sector-busqueda");
            const cityBtn = document.getElementById("cityButton");
            const sectorBtn = document.getElementById("sectorButton");

            // Asignar valores si existen
            const ciudad = currentFilters.ciudad || "";
            const sector = currentFilters.sector || "";

            // Actualizar inputs
            inputCiudad.value = ciudad;
            inputSector.value = sector;

            // Actualizar texto visible
            spanUbicacion.textContent = sector ? `${sector}, ${ciudad}` : ciudad;

            // Actualizar botones
            if (cityBtn) cityBtn.textContent = ciudad || "Seleccionar";
            if (sectorBtn) sectorBtn.textContent = sector || "Seleccionar";

            // Guardar selección en variables globales si existen
            if (typeof citySelected !== "undefined") citySelected = ciudad;
            if (typeof sectorSelected !== "undefined") sectorSelected = sector;


            //CREA UN CHIP DE LOS FILTROS SI EXISTE UN VALOR
            // ---- Lógica para crear chip de "Ubicación" ----
            if (currentFilters?.sector && currentFilters.sector.trim() !== "Todos los sectores") {
              // 🏙️ Caso 1: Hay sector (y por ende también ciudad)

              const ciudad = (currentFilters.ciudad || "").trim();
              const sector = currentFilters.sector.trim();
              const valor = ciudad || "Toda República Dominicana";

              const chipHTML = `
                <div class="filter-chip" data-id="ciudad-busqueda" data-sector="sector-busqueda">
                  Ubicación: ${sector}, ${valor}
                  <svg class="chip-close" height="15" width="15" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
                    <g id="close_1_">
                      <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
                      <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
                    </g>
                  </svg>
                </div>
              `;

              const chipObj = {
                key: "Ubicacion",
                value: chipHTML
              };

              chipsActivos.push(chipObj);

              console.log("📍 Chip de ubicación (con sector) agregado:", chipObj);
              console.log("📦 chipsActivos:", chipsActivos);

            } else if (currentFilters?.ciudad) {
              // 🏘️ Caso 2: Solo hay ciudad
              const ciudad = currentFilters.ciudad.trim();
              const chipHTML = `
                <div class="filter-chip" data-id="ciudad-busqueda">
                  Ubicación: ${ciudad}
                  <svg class="chip-close" height="15" width="15" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
                    <g id="close_1_">
                      <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
                      <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
                    </g>
                  </svg>
                </div>
              `;

              const chipObj = {
                key: "Ubicacion",
                value: chipHTML
              };

              chipsActivos.push(chipObj);

              console.log("📍 Chip de ubicación (solo ciudad) agregado:", chipObj);
              console.log("📦 chipsActivos:", chipsActivos);
            }


        }

        if (currentFilters?.precio_min || currentFilters?.precio_max) {
            const inputPrecioMin = document.getElementById("precio-min-inmueble");
            const inputPrecioMax = document.getElementById("precio-max-inmueble");
            
             // Supongamos que vienen de currentFilters
            if (currentFilters?.precio_min) inputPrecioMin.value = currentFilters.precio_min;
            if (currentFilters?.precio_max) inputPrecioMax.value = currentFilters.precio_max;

            //FUNCION PARA CREAR CHIP 
            crearChipRango(
              "Precio",                 // Label visible del chip
              "precio",                 // Prefijo de las propiedades (precio_min / precio_max)
              "precio-min-inmueble",    // ID del input mínimo
              "precio-max-inmueble",    // ID del input máximo
              currentFilters,           // Objeto con los filtros actuales
              chipsActivos              // Array global donde guardas los chips
            );

        }

        if (currentFilters?.metros_min || currentFilters?.metros_max) {
            const inputMetrosMin = document.getElementById("metros-min-inmueble");
            const inputMetrosMax = document.getElementById("metros-max-inmueble");

                if (currentFilters.metros_min) {
                inputMetrosMin.value = currentFilters.metros_min;
                }
                if (currentFilters.metros_max) {
                inputMetrosMax.value = currentFilters.metros_max;
                }

            //FUNCION PARA CREAR CHIP 
            crearChipRango(
              "Metros",                 // Label visible del chip
              "metros",                 // Prefijo de las propiedades (precio_min / precio_max)
              "metros-min-inmueble",    // ID del input mínimo
              "metros-max-inmueble",    // ID del input máximo
              currentFilters,           // Objeto con los filtros actuales
              chipsActivos              // Array global donde guardas los chips
            );    
        }

        if (currentFilters?.hab_min || currentFilters?.hab_max) {
        const inputHabMin = document.getElementById("hab-min-inmueble");
        const inputHabMax = document.getElementById("hab-max-inmueble");

        if (inputHabMin && inputHabMax) {
            if (currentFilters.hab_min) {
            inputHabMin.value = currentFilters.hab_min;
            }
            if (currentFilters.hab_max) {
            inputHabMax.value = currentFilters.hab_max;
            }

            console.log("🏠 Filtros de habitaciones aplicados:");
            console.log("mín:", inputHabMin.value);
            console.log("máx:", inputHabMax.value);
        } else {
            console.warn("⚠️ No se encontraron los inputs de habitaciones.");
        }

        //FUNCION PARA CREAR CHIP 
            
        }

        if (currentFilters?.banos_min || currentFilters?.banos_max) {
            const inputBanosMin = document.getElementById("banos-min-inmueble");
            const inputBanosMax = document.getElementById("banos-max-inmueble");

            if (inputBanosMin && inputBanosMax) {
                if (currentFilters.banos_min) {
                inputBanosMin.value = currentFilters.banos_min;
                }
                if (currentFilters.banos_max) {
                inputBanosMax.value = currentFilters.banos_max;
                }

                console.log("🛁 Filtros de baños aplicados:");
                console.log("mín:", inputBanosMin.value);
                console.log("máx:", inputBanosMax.value);
            } else {
                console.warn("⚠️ No se encontraron los inputs de baños.");
            }
        }
        //OFFSET OBTENER Y PONERLO
        document.getElementById("offset").value = currentFilters.offset || 0;

        //OBTENER ORDER DE FILTRO, SELECCIONARLO Y PONER VALOR EN INPUT
        if (currentFilters?.ordenar && currentFilters.ordenar.trim() !== "") {
          const ordenarSelect = document.getElementById("ordenar");
          const ordenarHidden = document.getElementById("ordenarHidden");
          const valorOrden = currentFilters.ordenar.toLowerCase();

          if (ordenarSelect) {
            // Obtener todas las opciones
            const opciones = ordenarSelect.querySelectorAll("option");

            // Quitar selección previa
            opciones.forEach(opt => opt.selected = false);

            // Buscar y seleccionar la correcta
            opciones.forEach(opt => {
              if (opt.value.toLowerCase() === valorOrden) {
                opt.selected = true;
              
              }
            });

            // Actualizar el input hidden
            if (ordenarHidden) {
              ordenarHidden.value = valorOrden;
            }
          } else {
            console.warn("⚠️ No se encontró el select con id 'ordenar'.");
          }
        }

        const chipsContainer = document.getElementById("chips-filtros");

        chipsActivos.forEach(chip => {
          chipsContainer.insertAdjacentHTML("beforeend", chip.value);
        });



}


document.addEventListener("DOMContentLoaded", () => {
    const selectOrdenar = document.getElementById("ordenar");
    const inputHidden = document.getElementById("ordenarHidden");

    // Cuando el usuario selecciona una opción
    selectOrdenar.addEventListener("change", () => {
      inputHidden.value = selectOrdenar.value;
      console.log("Valor guardado:", inputHidden.value); // solo para verificar
      submitForm('filtroPropiedades')
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
  // Función genérica para manejar grupos de botones
  const handleButtonGroup = (containerSelector, buttonSelector, inputId, transformFn) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const buttons = container.querySelectorAll(buttonSelector);
    const hiddenInput = document.getElementById(inputId);

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = transformFn(btn.dataset.value);
        console.log(value);
        hiddenInput.value = value;
        console.log(`Valor guardado en ${inputId}:`, value);
        submitForm('filtroPropiedades');
      });
    });
  };

  // 🔹 Aplica la función a tus grupos:
  handleButtonGroup(".btn-row[data-field='tipo_inmueble']", ".btn-pill", "tipo_inmueble", v => v.toLowerCase());
  handleButtonGroup(".chips[data-field='categoria']", ".chip", "categoria", v => v.trim());
  handleButtonGroup(".btn-row[data-field='moneda']", ".btn-pill", "moneda", v => v.toUpperCase());
});


// ==========================
// MANEJANDO "LOCATION" MODAL
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const containerCity = document.getElementById("containerCity");
  const containerSector = document.getElementById("containerSector");
  const divA = document.getElementById("divA");
  const divB = document.getElementById("divB");
  const locationSaveButton = document.getElementById("locationSaveButton");



  // =====================
  // ABRIR / CERRAR MODAL
  // =====================
  openModalBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.style.display = "none";
    closingInputCiudad();
    closingInputSector();
  }

  // =====================
  // CREAR INPUT DE CIUDADES
  // =====================
  divA.addEventListener("click", () => {
    // Si ya existe, lo cerramos
    if (inputCreated) return closingInputCiudad();

    // Si el de sector está abierto, lo cerramos también
    if (sectorCreated) closingInputSector();

    // Ocultamos temporalmente los sectores
    containerSector.style.display = "none";

    // Crear input de búsqueda
    const input = document.createElement("input");
    input.type = "text";
    input.id = "cityInput";
    input.placeholder = "Buscar ciudad...";
    containerCity.appendChild(input);
    input.focus();

    // Crear lista de ciudades
    const ul = document.createElement("ul");
    ul.id = "cityList";

    cities.forEach((city, index) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.className = "ciudades-busqueda";
      li.id = "ciudad" + index;
      ul.appendChild(li);
    });

    containerCity.appendChild(ul);
    inputCreated = true;

    // Filtrar mientras se escribe
    input.addEventListener("input", () => filterList(ul, input.value));

    // Evento: seleccionar ciudad
    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("ciudades-busqueda")) {
        citySelected = e.target.innerText.trim();
        document.getElementById("cityButton").innerText = citySelected;

        // Resetear sector cuando cambia la ciudad
        sectorSelected = "";
        document.getElementById("sectorButton").innerText = "Seleccionar";

        closingInputCiudad();
      }
    });
  });

  // =====================
  // CREAR INPUT DE SECTOR
  // =====================
  divB.addEventListener("click", () => {
    // Si no se ha elegido una ciudad, no permitir abrir sectores
    if (!citySelected) {
      alert("Primero seleccione una ciudad.");
      return;
    }

    // Si ya está abierto, cerrarlo
    if (sectorCreated) return closingInputSector();

    const sectorSel = allLocation[citySelected];
    if (!sectorSel) return console.log("No hay sectores para esta ciudad");

    // Crear input de búsqueda
    const input = document.createElement("input");
    input.type = "text";
    input.id = "sectorInput";
    input.placeholder = "Buscar sector...";
    containerSector.appendChild(input);
    input.focus();

    // Crear lista de sectores
    const ul = document.createElement("ul");
    ul.id = "sectorList";

    sectorSel.forEach((sector, index) => {
      const li = document.createElement("li");
      li.textContent = sector;
      li.className = "ciudades-busqueda";
      li.id = "sector" + index;
      ul.appendChild(li);
    });

    containerSector.appendChild(ul);
    sectorCreated = true;

    // Filtrar mientras se escribe
    input.addEventListener("input", () => filterList(ul, input.value));

    // Evento: seleccionar sector
    ul.addEventListener("click", (e) => {
      if (e.target.classList.contains("ciudades-busqueda")) {
        sectorSelected = e.target.innerText.trim();
        document.getElementById("sectorButton").innerText = sectorSelected;
        closingInputSector();
      }
    });
  });

  // =====================
  // GUARDAR UBICACIÓN
  // =====================
  locationSaveButton.addEventListener("click", () => {
    const cityInput = document.getElementById("ciudad-busqueda");
    const sectorInput = document.getElementById("sector-busqueda");

    cityInput.value = (citySelected || "").trim();
    sectorInput.value = (sectorSelected || "").trim();
    
    // 🔹 Mostrar en consola para ver qué se está guardando
    console.log("Ciudad seleccionada (input):", cityInput.value);
    console.log("Sector seleccionado (input):", sectorInput.value);

    handleLocationSelected();

    closeModal();
    submitForm('filtroPropiedades')
  });

  // =====================
  // FUNCIONES AUXILIARES
  // =====================
  function filterList(ul, text) {
    const filterText = text.trim().toLowerCase();
    ul.querySelectorAll("li").forEach((item) => {
      const visible =
        item.innerText.toLowerCase().includes(filterText) || !filterText;
      item.style.display = visible ? "block" : "none";
    });
  }

  function closingInputCiudad() {
    containerSector.style.display = "block";
    const inputCity = document.getElementById("cityInput");
    const listCity = document.getElementById("cityList");
    if (inputCity) inputCity.remove();
    if (listCity) listCity.remove();
    inputCreated = false;
  }

  function closingInputSector() {
    const inputSector = document.getElementById("sectorInput");
    const listSector = document.getElementById("sectorList");
    if (inputSector) inputSector.remove();
    if (listSector) listSector.remove();
    sectorCreated = false;
  }

  // =====================
  // MOSTRAR EN EL FILTRO PRINCIPAL
  // =====================
  function handleLocationSelected() {
    const city = citySelected || "";
    const sector = sectorSelected || "";

    let label =
      sector && city ? `${sector}, ${city}` : city || "Toda República Dominicana";

    // Acortar si es muy largo
    if (label.length > 30) label = label.substring(0, 27) + "...";

    const spanLocation = document.querySelector(".span-inmuebles-ubicacion");
    if (spanLocation) spanLocation.innerText = label;
  }

  // =====================
  // CARGAR CIUDADES DESDE API
  // =====================
  async function loadCities() {
    try {
      const response = await fetch("/api/cities");
      const data = await response.json();
      cities = Object.keys(data);
      allLocation = data;
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  }

  // Ejecutar al cargar
  loadCities();
});

// EVENT: Para que el check de amueblado

document.addEventListener("DOMContentLoaded", () => {
  const btnRow = document.querySelector('.btn-row[data-field="amueblado"]');
  const buttons = btnRow.querySelectorAll(".btn-pill");
  const hiddenInput = document.getElementById("amueblado");

  btnRow.addEventListener("click", (e) => {
    const clicked = e.target.closest(".btn-pill");
    if (!clicked) return;

    const isActive = clicked.classList.contains("is-active");

    // Si ya estaba activo, se desactiva y limpia el input
    if (isActive) {
      clicked.classList.remove("is-active");
      hiddenInput.value = "";
      console.log("🔹 Amueblado:", hiddenInput.value);
      submitForm('filtroPropiedades')
      return;
    }

    // Desactivar todos
    buttons.forEach((btn) => btn.classList.remove("is-active"));

    // Activar el que se clickeó
    clicked.classList.add("is-active");
    // Actualizar el valor oculto según el botón
    hiddenInput.value = clicked.dataset.value === "true" ? "true" : "false";

    console.log("🔹 Amueblado:", hiddenInput.value);
    submitForm('filtroPropiedades')
  });
});



//FUNCTION: Para precio, metros y hab banos

/*function syncInputWithHidden(visibleId, hiddenName) {
  const visibleInput = document.getElementById(visibleId);
  const hiddenInput = document.querySelector(`input[type="hidden"][name="${hiddenName}"]`);

  if (!visibleInput || !hiddenInput) return;

  visibleInput.addEventListener("input", () => {
    const value = visibleInput.value.trim();
    hiddenInput.value = value;
    console.log(`${hiddenName} → ${hiddenInput.value}`); // 👀 Verificar
  });
}

syncInputWithHidden("metros-min", "metros_min");
syncInputWithHidden("metros-max", "metros_max");*/


//FUNCTION PARA SOMETER FORMULARIO

function submitForm(formId) {
  const form = document.getElementById(formId);

  if (!form) {
    console.error(`⚠️ Formulario con id "${formId}" no encontrado.`);
    return;
  }

  // Puedes hacer validaciones previas aquí si quieres
  // por ejemplo: if (!form.checkValidity()) return;

  form.submit();
}

/*//CONTROL DE FILTROS Y CHIPS

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Objeto de filtros actual
  console.log(currentFilters);

  const chipsContainer = document.querySelector("#chips-filtros");
  const form = document.querySelector("#filtroPropiedades");

  // 🔧 Función principal
  function renderChips(filters) {

    if (chipsContainer) {
    chipsContainer.innerHTML = "";
    }
    for (const [key, value] of Object.entries(filters)) {
      if (["offset", "ordenar"].includes(key)) continue;

      // Agrupar los rangos en chips combinados
      if (key === "precio_min" || key === "precio_max") {
        crearChipRango("Precio", filters.precio_min, filters.precio_max, ["precio_min", "precio_max"]);
        continue;
      }
      if (key === "metros_min" || key === "metros_max") {
        crearChipRango("Metros²", filters.metros_min, filters.metros_max, ["metros_min", "metros_max"]);
        continue;
      }
      if (key === "hab_min" || key === "hab_max") {
        crearChipRango("Habitaciones", filters.hab_min, filters.hab_max, ["hab_min", "hab_max"]);
        continue;
      }
      if (key === "banos_min" || key === "banos_max") {
        crearChipRango("Baños", filters.banos_min, filters.banos_max, ["banos_min", "banos_max"]);
        continue;
      }

      // Evitar duplicados de rangos
      if (["precio_max", "metros_max", "hab_max", "banos_max"].includes(key)) continue;

      // Saltar valores vacíos o falsos
      if (value === "" || value === null || value === false) continue;

      crearChipNormal(key, value);
    }
  }

  // 🧱 Chip normal
  function crearChipNormal(key, value) {
    const chip = document.createElement("div");
    chip.classList.add("chip-aplicado");
    chip.dataset.keys = key;
    chip.textContent = `${formatearLabel(key)}: ${value}`;

    const close = document.createElement("span");
    close.classList.add("chip-close");
    close.textContent = "×";
    close.title = "Eliminar filtro";
    close.addEventListener("click", () => eliminarFiltro([key], chip));

    chip.appendChild(close);
    chipsContainer.appendChild(chip);
  }

  // 💰 Chip de rango (ej: Precio: 1000 - 5000)
  function crearChipRango(label, minVal, maxVal, keys) {
    const min = minVal !== null && minVal !== "" && minVal !== undefined ? minVal : null;
    const max = maxVal !== null && maxVal !== "" && maxVal !== undefined ? maxVal : null;

    // Si no hay ninguno, no crear chip
    if (min === null && max === null) return;

    const chip = document.createElement("div");
    chip.classList.add("chip-aplicado");
    chip.dataset.keys = keys.join(",");

    // Texto flexible
    let texto = `${label}: `;
    if (min !== null && max !== null) texto += `${min} - ${max}`;
    else if (min !== null) texto += `≥ ${min}`;
    else if (max !== null) texto += `≤ ${max}`;
    chip.textContent = texto;

    const close = document.createElement("span");
    close.classList.add("chip-close");
    close.textContent = "×";
    close.title = "Eliminar filtro";
    close.addEventListener("click", () => eliminarFiltro(keys, chip));

    chip.appendChild(close);
    chipsContainer.appendChild(chip);
  }

  // ✂️ Eliminar filtro
  function eliminarFiltro(keys, chipElement) {
    chipElement.remove();

    keys.forEach(key => {
      currentFilters[key] = "";
      const input = form.querySelector(`[name='${key}']`);
      if (input) input.value = "";
    });

    console.log("🧹 Eliminado:", keys);
    console.log("Nuevo objeto filtros:", currentFilters);

    // Reenvía formulario
    form.submit();
  }

  // 🏷️ Etiquetas legibles
  function formatearLabel(key) {
    const map = {
      tipo_inmueble: "Tipo",
      categoria: "Categoría",
      ciudad: "Ciudad",
      sector: "Sector",
      moneda: "Moneda",
      amueblado: "Amueblado"
    };
    return map[key] || key;
  }

  // 🚀 Inicializar
  renderChips(currentFilters);
});*/


function aplicarFiltro(inputId, containerId, buttonClass, valorActual) {
  if (!valorActual) return; // No hay valor -> no hace nada

  const input = document.getElementById(inputId);
  const botones = document.querySelectorAll(`#${containerId} .${buttonClass}`);
  const valorLower = valorActual.toLowerCase();

  // ✅ Asignar valor al input si existe
  if (input) {
    input.value = valorActual;
    
  } else {
    console.warn(`⚠️ No se encontró el elemento con id '${inputId}'`);
  }

  // ✅ Quitar 'is-active' de todos y activar el que coincide
  botones.forEach(btn => {
    btn.classList.remove("is-active");

    if (btn.dataset.value.toLowerCase() === valorLower) {
      btn.classList.add("is-active");
    
    }
  });
}


//FUNCION PARA CREAR UN CHIP PARA PRECIO, HABITACION, BANOS Y METRO

function crearChipRango(label, key, idMin, idMax, currentFilters, chipsActivos) {
  const minKey = `${key}_min`;
  const maxKey = `${key}_max`;

  const tieneMin = currentFilters?.[minKey] !== null && currentFilters?.[minKey] !== "";
  const tieneMax = currentFilters?.[maxKey] !== null && currentFilters?.[maxKey] !== "";

  if (!tieneMin && !tieneMax) return; // si no hay valores, no crear chip

  const valorMin = tieneMin ? Number(currentFilters[minKey]).toLocaleString("en-US") : "";
  const valorMax = tieneMax ? Number(currentFilters[maxKey]).toLocaleString("en-US") : "";

  // Crear texto dinámico
  let textoChip = `${label}: `;
  if (tieneMin && tieneMax) textoChip += `${valorMin} - ${valorMax}`;
  else if (tieneMin) textoChip += `${valorMin} o más`;
  else if (tieneMax) textoChip += `${valorMax} o menos`;

  // Crear HTML del chip
  const chipHTML = `
    <div class="filter-chip" data-id="${idMin}" data-secundary="${idMax}">
      ${textoChip}
      <svg class="chip-close" height="15" width="15" viewBox="0 0 320.591 320.591" xmlns="http://www.w3.org/2000/svg">
        <g id="close_1_">
          <path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path>
          <path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path>
        </g>
      </svg>
    </div>
  `;

  // Crear el objeto y agregarlo al array global
  const chipObj = {
    key: label,
    value: chipHTML
  };

  chipsActivos.push(chipObj);

  console.log(`💰 Chip de ${label.toLowerCase()} agregado:`, chipObj);
  console.log("📦 chipsActivos:", chipsActivos);
};
