
// Obtaining different elements from an input event 
 console.log(anuncio);
const saveAdBtn = document.getElementById("save-ad-btn"); //Button to save add
saveAdBtn.addEventListener("click", () => {
  console.log("Save button clicked!");
});
let usuarioLoggeado = null;

 fetch("/anuncio/usuario-info")
  .then(res => res.json())
  .then(data => {
    if (data.usuario) {
        usuarioLoggeado = data.usuario;
    } 
  });


//Poner el total de imagenes en desktop imagenes.
const totalSpan = document.querySelector(".image-counter-total");
totalSpan.innerHTML = anuncio.imagenes.length;


const slides = document.querySelectorAll(".slide"); // All the images containers
slides.forEach((slide, index) => {
});


const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');


const prevBtn = document.getElementById("prev"); // Botón para mover imágenes hacia atrás
const nextBtn = document.getElementById("next"); // Botón para mover imágenes hacia adelante

let isShowingA = true; // para saber cual grupo de imagenes muestra.

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    console.log("Botón Prev clickeado");
    const primerasCinco = anuncio.imagenes.slice(0, 5);
    
    prevBtn.style.display = "none";
    nextBtn.style.display = "flex";
    isShowingA = !isShowingA; // 🔄 cambia true ↔ false
    console.log("Ahora isShowingA es:", isShowingA);
    proyectarImagenes(primerasCinco);
  });

  nextBtn.addEventListener("click", () => {
    console.log("Botón Next clickeado");
    const ultimasCinco = anuncio.imagenes.slice(5, 10);
    nextBtn.style.display = "none";
    prevBtn.style.display = "flex";
    isShowingA = !isShowingA; // 🔄 cambia true ↔ false
    proyectarImagenes(ultimasCinco);
  });
}


let index = 0; // empezamos en el primer slide
let startX = 0;
let isDragging = false;
let slidesImg = []; // 🔑 declarada vacía para usar más tarde
// Tomar solo las primeras 5 imágenes
const primerasCinco = anuncio.imagenes.slice(0, 5);
const track = document.getElementById("carousel");
// Recorrerlas con forEach
proyectarImagenes(primerasCinco);


function proyectarImagenes(imagenesElegidas) {
  let carousel = document.getElementById('carousel'); // Seleccionar los spans
    const currentSpan = document.querySelector(".image-counter-current");
    currentSpan.innerHTML = imagenesElegidas.length + (isShowingA ? 0 : 5);


  carousel.innerHTML = "";

  imagenesElegidas.forEach((imgObj, i) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');

    const numeroImagenes = imagenesElegidas.length;
    if (numeroImagenes === 1) {
      if (i === 0) slideDiv.classList.add("enorme");
    } else if (numeroImagenes === 2) {
      slideDiv.classList.add("grande");
    } else if (numeroImagenes === 3) {
      if (i === 0) slideDiv.classList.add("grande");
      else slideDiv.classList.add("segunda");
    } else if (numeroImagenes === 4) {
      if (i === 0) slideDiv.classList.add("grande");
      else if (i === 1) slideDiv.classList.add("segunda");
    } else {
      if (i === 0) slideDiv.classList.add("grande");
    }

    // Crear la imagen
    const img = document.createElement('img');
    img.src = imgObj.image_url;
    img.alt = `Imagen ${i + 1}`;
    img.id = `imagen-${i}`;


    //CUANDO SE DA CLICK A UNA IMAGEN EN DESKTOP
    img.addEventListener('click', () => {
      console.log(img.src, imgObj.id);
      const idBuscado = imgObj.id;

let index = anuncio.imagenes.findIndex(img => img.id === idBuscado);

console.log(index); // 👉 1

      modal.style.display = 'flex';


// Obtener elementos HTML
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modalImage = document.getElementById('modalImage');
const contadorElem = document.getElementById('contador');

// Función para actualizar la imagen y el contador
function actualizarImagen() {
    modalImage.src = anuncio.imagenes[index].image_url;
    contadorElem.textContent = `${index + 1} / ${anuncio.imagenes.length}`;
}

// Event listeners para los botones
prevBtn.addEventListener('click', () => {
    index--; // restar 1
    if (index < 0) index = anuncio.imagenes.length - 1; // loop al final
    actualizarImagen();
});

nextBtn.addEventListener('click', () => {
    index++; // sumar 1
    if (index >= anuncio.imagenes.length) index = 0; // loop al inicio
    actualizarImagen();
});



      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        imgSelected.remove();

      });

      // Inicializa con la primera imagen
actualizarImagen();
    });

    slideDiv.appendChild(img);
    carousel.appendChild(slideDiv);

    
  });



}



//CARUSEL PARA IMAGENES PANTALLA MOVIL
document.addEventListener("DOMContentLoaded", () => {
    const carouselMovil = document.querySelector(".carousel-images");
    const slidesMovil = document.querySelectorAll(".slideMovil");
    const prevBtnMovil = document.querySelector(".prev-btn");
    const nextBtnMovil = document.querySelector(".next-btn");

    let currentIndex = 0;
    const slideCount = slidesMovil.length;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Botones
    prevBtnMovil.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextBtnMovil.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Eventos táctiles
    slidesMovil.forEach((slide, index) => {
        slide.addEventListener("touchstart", dragStart(index));
        slide.addEventListener("touchend", dragEnd);
        slide.addEventListener("touchmove", drag);
    });

    // Prevenir arrastre de imágenes
    document.querySelectorAll(".slideMovil img").forEach((img) => {
        img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    // Ir a un slide específico
    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        currentIndex = index;
        currentTranslate = -index * 100; 
        prevTranslate = currentTranslate;

        // transición suave
        carouselMovil.style.transition = "transform 0.3s ease";
        carouselMovil.style.transform = `translateX(${currentTranslate}%)`;

        slidesMovil.forEach(slide => slide.classList.remove("active"));
        slidesMovil[index].classList.add("active");
    }

    // Drag functions
    function dragStart(index) {
        return function (event) {
            isDragging = true;
            startPos = getPositionX(event);
            carouselMovil.style.transition = "none"; // quitar transición al arrastrar
            animationID = requestAnimationFrame(animation);
        };
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + ((currentPosition - startPos) / window.innerWidth) * 100;
        }
    }

    function dragEnd() {
        if (isDragging) {
            cancelAnimationFrame(animationID);
            isDragging = false;

            const movedBy = currentTranslate - prevTranslate;

            // si se desliza lo suficiente, cambia de slide
            if (movedBy < -20) currentIndex += 1;
            if (movedBy > 20) currentIndex -= 1;

            goToSlide(currentIndex);
            carouselMovil.classList.remove("grabbing");
        }
    }

    function getPositionX(event) {
        return event.type.includes("mouse")
            ? event.pageX
            : event.touches[0].clientX;
    }

    function animation() {
        carouselMovil.style.transform = `translateX(${currentTranslate}%)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // Inicializar primer slide
    goToSlide(0);
});



//LOGICA PARA LA TARJETA DE CONTACTOS
document.addEventListener("DOMContentLoaded", () => {
 const floatingBox = document.getElementById('floatingBox');
    const layoutWrapper = document.querySelector(".infoAnuncio");
    const windowPage = document.querySelector(".anuncioPage");
    const initialTop = floatingBox.offsetTop;
    const centerY = window.innerHeight / 2 - floatingBox.offsetHeight / 2;

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY; //distancia desplzada de arriba
      const wrapperTop = layoutWrapper.offsetTop; //distancia del contenedor a arriba

      if (scrollY > wrapperTop + initialTop - centerY) {
        // Fijar en el centro al bajar
        floatingBox.style.position = "fixed";
        floatingBox.style.right = "0";
        floatingBox.style.width = "23%";
        floatingBox.style.transform = "translateX(-54.5%)";
        floatingBox.style.top = `${centerY}px`;
        
      } else {
        // Volver a posición original al subir
        floatingBox.style.position = 'absolute';
        floatingBox.style.top = `${initialTop}px`;
        floatingBox.style.right = "-65%";
        floatingBox.style.width = "50%";
        floatingBox.style.transform = "translateX(0)";
      }
    });

    if (anuncio.favoritos) {
    textoGuardar.textContent = "Guardado";
    icono.setAttribute("fill", "#b71c1c"); // Amarillo
    }
});


/*AREA DE DESCRIPCION DEL ANUNCIO*/
const texto = document.getElementById('descripcionTexto');
    const boton = document.getElementById('verMasBtn');

    boton.addEventListener('click', () => {
      const esCorto = texto.classList.contains('corto');
      if (esCorto) {
        texto.classList.remove('corto');
        boton.innerHTML = `<div>
            <svg width="15" height="15" version="1.1" id="fi_130906" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 240.835 240.835" style="enable-background:new 0 0 240.835 240.835;" xml:space="preserve">
<g>
	<path id="Expand_Less" d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155
		c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155
		L129.007,57.819z"></path>
	<g>
	</g>
	<g>
	</g>
	<g>
	</g>
	<g>
	</g>
	<g>
	</g>
	<g>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
        </div>
        Ver menos`;
      } else {
        texto.classList.add('corto');
        boton.innerHTML = `<div>
            <svg width="15" height="15" version="1.1" id="fi_32195" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;" xml:space="preserve">
            <g>
                <path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751
                    c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0
                    c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"></path>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            </svg>
        </div>
        Ver más`;
      }
    });



    // EVENT para cuando dan click al botón de contacto
document.addEventListener("DOMContentLoaded", () => {
  // Obtener el botón
  const btnContacto = document.getElementById("btnContacto");
  if (!btnContacto) return; // Si no existe el botón, salir

  // Obtener el número de teléfono (si existe)
  const telefonoRaw = anuncio?.usuario?.telefono || "";

  // Formatear el número si tiene 10 dígitos
  const telefonoFormateado = /^\d{10}$/.test(telefonoRaw)
    ? telefonoRaw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    : telefonoRaw;

  // Evento click
  btnContacto.addEventListener("click", () => {
    if (telefonoFormateado) {
      btnContacto.textContent = telefonoFormateado;
    } else {
      btnContacto.textContent = "No disponible";
    }
  });
});


// Se busca todos los elementos, el botón, el texto adentro y el icono 
const btn = document.getElementById("save-ad-btn");
const textoGuardar = btn.querySelector(".texto");
const icono = btn.querySelector(".icono");
let guardando = null;
btn.addEventListener("click", () => {
    //Esto da un resultado true si es Guardar y false si no.
    guardando = textoGuardar.textContent.trim() === "Guardar";
    console.log("Usuario:", usuarioLoggeado);
  if (guardando) {
    textoGuardar.textContent = "Guardado";
    icono.setAttribute("fill", "#b71c1c"); // Amarillo
  } else {
    textoGuardar.textContent = "Guardar";
    icono.setAttribute("fill", "black");
  }
});

  //EVENT DEL SAVE BOTON PARA GUARDAR EL ANUNCIO 
  document.getElementById("save-ad-btn").addEventListener("click", async (e) => {
    const anuncioId = anuncio.id;

    if (guardando === true) {
            try {

            console.log(guardando);
            const res = await fetch(`/anuncio/guardar-favorito/${anuncioId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            // Si el servidor redirige (usuario no autenticado), se va al login
            if (res.redirected) {
                window.location.href = res.url;
                return;
            }

            const data = await res.json();
            alert(data.message || "Anuncio guardado correctamente");
            } catch (err) {
            console.error("Error al guardar anuncio:", err);
            }
    } else {
        try {

            console.log(guardando);
            const res = await fetch(`/anuncio/eliminar-favorito/${anuncioId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            // Si el servidor redirige (usuario no autenticado), se va al login
            if (res.redirected) {
                window.location.href = res.url;
                return;
            }

            const data = await res.json();
            alert(data.message || "Anuncio guardado correctamente");
            } catch (err) {
            console.error("Error al guardar anuncio:", err);
            }
    }
  });

  //EVENT: Para quecuando le den a editar haga algo
// Espera que el DOM cargue
  document.addEventListener("DOMContentLoaded", () => {
    const editarBtn = document.querySelector(".editar-btn");

    if (editarBtn) {
      editarBtn.addEventListener("click", () => {
        const anuncioId = editarBtn.getAttribute("data-anuncio-id");

        // Redirige a la ruta de edición usando GET
        window.location.href = `/anuncio/editar/${anuncioId}`;
      });
    }
  });



