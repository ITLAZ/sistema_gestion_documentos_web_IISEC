import { loadCards } from "./handlers/card_handler.js";
import {
  getAllDocuments,
  getDocumentById,
  getDocumentsByType,
  searchDocuments,
} from "./services/api_service.js";
import { loadNavbar } from "./services/navbar_service.js";

// Verificar si el usuario está autenticado
(function verificarAutenticacion() {
  // Función para obtener una cookie por su nombre
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const idUsuario = getCookie("id_usuario");
  if (!idUsuario) {
    // Redirigir al login si no hay id_usuario en las cookies
    window.location.href = "/login";
  }
})();

// Cargar el navbar inmediatamente
loadNavbar();

// Variables para la paginación y el tipo seleccionado
let currentPage = 1; // Número de página actual
const itemsPerPage = 10; // Cantidad de elementos por página
let selectedType = "";
let sortBy = "anio_publicacion"; // Campo de ordenamiento predeterminado
let sortOrder = "asc"; // Orden predeterminado (ascendente)

// Función para alternar el orden ascendente/descendente
function toggleSortOrder() {
  sortOrder = sortOrder === "asc" ? "desc" : "asc";
  document.getElementById("date-order").innerText = sortOrder === "asc" ? "Ascendente" : "Descendente";
}

// Función para actualizar el campo de ordenamiento
function setSortBy(field) {
  sortBy = field;
  fetchAndRenderDocuments(); // Actualizar los resultados
}

document.addEventListener("DOMContentLoaded", async () => {
  const typeSelector = document.getElementById("type-selector");

  // Si hay un tipo previamente seleccionado, restablecerlo y cargar documentos.
  if (selectedType) {
    console.log("Restableciendo el tipo seleccionado:", selectedType);
    typeSelector.value = selectedType;
    await fetchAndRenderDocuments();
  }

  // Manejar el cambio de selección del tipo de documento.
  typeSelector.addEventListener("change", async () => {
    selectedType = typeSelector.value;
    console.log("Tipo seleccionado:", selectedType);
    currentPage = 1; // Reiniciar a la primera página
    await fetchAndRenderDocuments();
  });

  // Configurar los eventos de los botones de ordenamiento
  document.getElementById("sort-title").addEventListener("click", () => setSortBy("titulo"));
  document.getElementById("sort-author").addEventListener("click", () => setSortBy("autores"));
  document.getElementById("sort-year").addEventListener("click", () => setSortBy("anio_publicacion"));

  // Configurar el evento del botón de orden ascendente/descendente
  document.getElementById("date-order").addEventListener("click", () => {
      toggleSortOrder();
      fetchAndRenderDocuments(); // Actualizar los resultados
  });

  // Configurar los eventos de los botones de paginación.
  document.getElementById("prev-page").addEventListener("click", prevPage);
  document.getElementById("next-page").addEventListener("click", nextPage);
});

// Función para obtener y renderizar documentos
export async function fetchAndRenderDocuments() {
  try {
    let documentsData;
    if (selectedType === "all-types") {
      documentsData = await getAllDocuments("", currentPage, itemsPerPage);
    } else {
      documentsData = await getDocumentsByType(
        selectedType,
        currentPage,
        itemsPerPage,
        sortBy, 
        sortOrder
      );
    }

    console.log("Tipo seleccionado:", selectedType);
    console.log("Respuesta del backend:", documentsData);

    const data = documentsData.data || documentsData;

    // Verificar si la respuesta es un array vacío.
    if (Array.isArray(data) && data.length === 0) {
      // No hay resultados, ocultar los controles de paginación y mostrar un mensaje.
      document.getElementById("pagination-controls").style.display = "none";
      document.getElementById("page-info").innerText =
        "No se encontraron resultados.";
      loadCards([], selectedType); // Limpia las tarjetas mostradas.
      return;
    }

    // Si hay datos, mostrar las tarjetas y los controles de paginación.
    loadCards(data, selectedType);

    // Mostrar los controles de paginación.
    document.getElementById("pagination-controls").style.display = "block";

    // Mostrar u ocultar el botón "Siguiente" dependiendo de si hay más elementos que el tamaño de la página.
    const nextPageButton = document.getElementById("next-page");
    nextPageButton.style.display =
      data.length < itemsPerPage ? "none" : "inline-block";

    // Mostrar u ocultar el botón "Anterior" si estamos en la primera página.
    const prevPageButton = document.getElementById("prev-page");
    prevPageButton.style.display = currentPage === 1 ? "none" : "inline-block";

    // Actualizar la información de la página actual.
    document.getElementById("page-info").innerText = `Página ${currentPage}`;
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
  }
}

// Función para ir a la página siguiente
function nextPage() {
  currentPage++;
  fetchAndRenderDocuments();
}

// Función para ir a la página anterior
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchAndRenderDocuments();
  }
}

//Visualizacion de documento por id
document.addEventListener("DOMContentLoaded", () => {
  loadDocumentDetails();
});

export async function loadDocumentDetails() {
  const documentType = sessionStorage.getItem("documentType");
  const id = sessionStorage.getItem("documentId");

  let documentData;

  console.log("Tipo de documento recuperado:", documentType);
  console.log("ID del documento recuperado:", id);

  if (id && documentType) {
    try {
      documentData = await getDocumentById(documentType, id);
      console.log(
        "Detalles del documento recibidos del backend:",
        documentData
      );

      documentData = documentData._source || documentData;
    } catch (error) {
      console.error("Error al obtener los detalles del documento:", error);
      return;
    }
  }

  if (documentData) {
    displayDocumentDetails(documentData, documentType);
  } else {
    console.error("No se encontraron parámetros válidos para el documento.");
  }
}

// Función para mostrar los detalles del documento y adaptar la vista de acuerdo al tipo
function displayDocumentDetails(data, documentType) {
  console.log("Detalles del documento recibidos:", data);
  console.log("Tipo de documento:", documentType);

  // Si el documento proviene de `all-types`, extraer el contenido de `_source`
  const documentData = data._source || data;

  // Ocultar todos los campos opcionales al inicio
  [
    "#cover-info",
    "#editorial",
    "#numero_articulo",
    "#nombre_revista",
    "#numero_identificacion",
    "#titulo_capitulo",
    "#titulo_libro",
    "#descripcion",
    "#observacion",
    "#msj_clave",
  ].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "none";
    }
  });

  // Asignar el tipo de documento según el valor de documentType
  let tipodoc = "";

  switch (documentType) {
    case "libros":
      tipodoc = "Libros";
      break;
    case "articulos-revistas":
      tipodoc = "Artículo de Revista";
      break;
    case "capitulos-libros":
      tipodoc = "Capítulo de Libro";
      break;
    case "documentos-trabajo":
      tipodoc = "Documento de Trabajo";
      break;
    case "ideas-reflexiones":
      tipodoc = "Ideas y Reflexiones";
      break;
    case "info-iisec":
      tipodoc = "Info IISEC";
      break;
    case "policies-briefs":
      tipodoc = "Policy Briefs";
      break;
    default:
      console.error("Tipo de documento desconocido:", documentType);
      return; // Detener si no hay tipo
  }

  // Mostrar campos comunes
  document.getElementById("title").textContent =
    documentData.titulo ||
    documentData.titulo_capitulo ||
    "Título no disponible";
  document.getElementById("cover").src =
    documentData.portada || "https://placehold.com/600x400";
  document.getElementById("type").textContent =
    tipodoc || "Tipo de documento no disponible";
  document.getElementById("authors").textContent = documentData.autores
    ? documentData.autores.join(", ")
    : "Autores no disponibles";
  document.getElementById("published").textContent =
    documentData.anio_publicacion ||
    documentData.anio_revista ||
    "Fecha no disponible";

  // Mostrar campos específicos según el tipo de documento
  switch (documentType) {
    case "libros":
      document.getElementById("editorial").style.display = "block";
      document.getElementById("editorial-text").textContent =
        documentData.editorial || "Editorial no disponible";
      document.getElementById("descripcion").style.display = "block";
      document.getElementById("description").textContent =
        documentData.abstract || "Descripción no disponible";
      break;

    case "articulos-revistas":
      document.getElementById("numero_articulo").style.display = "block";
      document.getElementById("article-number").textContent =
        documentData.numero_articulo || "Número de artículo no disponible";
      document.getElementById("nombre_revista").style.display = "block";
      document.getElementById("revista").textContent =
        documentData.nombre_revista || "Nombre de la revista no disponible";
      document.getElementById("editorial").style.display = "block";
      document.getElementById("editorial-text").textContent =
        documentData.editorial || "Editorial no disponible";
      document.getElementById("descripcion").style.display = "block";
      document.getElementById("description").textContent =
        documentData.abstract || "Descripción no disponible";
      break;

    case "capitulos-libros":
      document.getElementById("numero_identificacion").style.display = "block";
      document.getElementById("numero_identificacion_value").textContent =
        documentData.numero_identificacion ||
        "Número de identificación no disponible";
      document.getElementById("titulo_capitulo").style.display = "block";
      document.getElementById("titulo_capitulo_value").textContent =
        documentData.titulo_capitulo || "Título del capítulo no disponible";
      document.getElementById("titulo_libro").style.display = "block";
      document.getElementById("titulo_libro_value").textContent =
        documentData.titulo_libro || "Título del libro no disponible";
      document.getElementById("editores").style.display = "block";
      document.getElementById("editores_value").textContent =
        documentData.editores
          ? documentData.editores.join(", ")
          : "Editores no disponibles";
      document.getElementById("editorial").style.display = "block";
      document.getElementById("editorial-text").textContent =
        documentData.editorial || "Editorial no disponible";
      break;

    case "documentos-trabajo":
      document.getElementById("numero_identificacion").style.display = "block";
      document.getElementById("numero_identificacion_value").textContent =
        documentData.numero_identificacion ||
        "Número de identificación no disponible";
      document.getElementById("descripcion").style.display = "block";
      document.getElementById("description").textContent =
        documentData.abstract || "Descripción no disponible";
      break;

    case "ideas-reflexiones":
    case "info-iisec":
      document.getElementById("observacion").style.display = "block";
      document.getElementById("observation").textContent =
        documentData.observaciones || "Observación no disponible";
      break;

    case "policies-briefs":
      document.getElementById("msj_clave").style.display = "block";
      document.getElementById("msj_claves").textContent =
        documentData.mensaje_clave || "Mensaje clave no disponible";
      break;

    default:
      console.error("Tipo de documento desconocido:", documentType);
      alert("El tipo de documento no está disponible.");
      return; // Detener si no hay tipo
  }

  // Mostrar el PDF si está disponible
  const pdfIframe = document.getElementById("pdf-frame");
  const pdfDownloadLink = document.getElementById("pdf-download-link");

  if (
    documentData.link_pdf &&
    documentData.link_pdf.trim().toLowerCase().endsWith(".pdf")
  ) {
    pdfIframe.src = documentData.link_pdf;
    pdfDownloadLink.href = documentData.link_pdf;
    pdfIframe.style.display = "block";
  } else if (documentData.direccion_archivo) {
    const nombreArchivo = documentData.direccion_archivo.split("\\").pop();
    const archivoUrl = `http://localhost:3000/file-handler/file/${nombreArchivo}`;
    pdfIframe.src = archivoUrl;
    pdfDownloadLink.href = archivoUrl;
    pdfIframe.style.display = "block";
  } else {
    pdfIframe.style.display = "none";
    const pdfPreviewContainer = document.querySelector(".pdf-preview");

    const messageContainer = document.createElement("div");
    messageContainer.innerHTML = `
            <p>Lo sentimos, el documento no se encuentra actualmente disponible.</p>
            <p>Puede ingresar al siguiente link para encontrarlo: <a href="${
              documentData.link_pdf || "#"
            }" target="_blank">${
      documentData.link_pdf || "No disponible"
    }</a></p>
        `;

    pdfPreviewContainer.appendChild(messageContainer);
  }
}

// Manejo de eventos globales para los dropdowns
document.addEventListener("click", function (event) {
  const dropBtn = event.target.closest(".drop-btn");
  if (dropBtn) {
    const dropdownContent = dropBtn.nextElementSibling;
    const isVisible = dropdownContent.style.display === "block";
    document
      .querySelectorAll(".dropdown-content")
      .forEach((content) => (content.style.display = "none"));
    dropdownContent.style.display = isVisible ? "none" : "block";
    event.stopPropagation();
  } else {
    document
      .querySelectorAll(".dropdown-content")
      .forEach((content) => (content.style.display = "none"));
  }
});

// Delegación de eventos para las opciones del menú dropdown
document.addEventListener("click", function (event) {
  const actionItem = event.target.closest(".dropdown-content a");
  if (actionItem) {
    event.preventDefault();
    const targetUrl = actionItem.getAttribute("href");
    window.location.href = targetUrl;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  // Aplicar el tema almacenado en localStorage
  const storedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", storedTheme);
  console.log("Tema almacenado aplicado:", storedTheme);

  // Cargar el componente de navegación
  fetch("../components/menu_navegacion.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("menu-container").innerHTML = data;

      // Ahora que el componente está cargado, agregar el event listener
      const themeToggleButton = document.getElementById("theme-toggle");
      if (themeToggleButton) {
        console.log("Botón de cambio de tema encontrado");
        themeToggleButton.addEventListener("click", function () {
          const currentTheme = body.getAttribute("data-theme");
          const newTheme = currentTheme === "light" ? "dark" : "light";
          body.setAttribute("data-theme", newTheme);
          localStorage.setItem("theme", newTheme);
          console.log("Tema cambiado a:", newTheme);
        });
      } else {
        console.log("Botón de cambio de tema no encontrado");
      }
    })
    .catch((error) =>
      console.error("Error al cargar el componente de navegación:", error)
    );
});

//BUSQUEDA
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const typeSelector = document.getElementById("type-selector");
  const keywordsInput = document.getElementById("keywords");
  const authorInput = document.getElementById("author");
  const publicationDateInput = document.getElementById("publication-date");
  const currentYear = new Date().getFullYear();

  // Botones de ordenamiento
  const sortYearButton = document.getElementById("sort-year");
  const dateOrderButton = document.getElementById("date-order");

  // Parámetros para la paginación
  let currentPage = 1;
  const itemsPerPage = 10;

  // Manejar el evento de clic del botón de búsqueda
  searchButton.addEventListener("click", async () => {
    const documentType = typeSelector.value;
    const query = keywordsInput.value.trim(); // Palabra clave (obligatoria)
    const author = authorInput.value.trim();
    const anio_publicacion = publicationDateInput.value;

    // Validar que se ingrese una palabra clave
    if (!query) {
      alert("Por favor, ingrese una palabra clave para realizar la búsqueda.");
      return;
    }

    if (anio_publicacion) {
      if (
        isNaN(anio_publicacion) ||
        anio_publicacion < 1900 ||
        anio_publicacion > currentYear
      ) {
        alert(`Por favor, ingrese un año entre 1900 y ${currentYear}.`);
        publicationDateInput.value = "";
        return;
      }
    }

    // Ocultar botones adicionales y dejar solo el de orden ascendente/descendente
    toggleSortButtonsVisibility();

    // Ejecutar búsqueda con los parámetros actuales de ordenamiento
    await executeSearch(documentType, query, anio_publicacion, author);
  });

  // Función para ejecutar la búsqueda
  async function executeSearch(documentType, query, anio_publicacion, author) {
    try {
      const data = await searchDocuments(
        documentType,
        query,
        currentPage,
        itemsPerPage,
        anio_publicacion,
        author,
        sortBy,
        sortOrder
      );

      console.log("Datos recibidos del backend:", data);

      // Renderizar los resultados obtenidos
      renderResults(data, documentType);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      alert(
        "Hubo un error al realizar la búsqueda. Por favor, inténtelo de nuevo."
      );
    }
  }

  // Configurar evento para el botón de orden ascendente/descendente
  dateOrderButton.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    dateOrderButton.innerText = sortOrder === "asc" ? "Ascendente" : "Descendente";
    executeSearch(typeSelector.value, keywordsInput.value.trim(), publicationDateInput.value, authorInput.value.trim());
  });

  // Función para alternar la visibilidad de botones (mostrar solo el de orden asc/desc)
  function toggleSortButtonsVisibility() {
    sortYearButton.style.display = "none"; // Ocultar el botón de año
    dateOrderButton.style.display = "inline-block"; // Mostrar solo el botón de orden ascendente/descendente
  }

  // Al seleccionar una nueva opción en el combobox, se muestran todos los botones
  typeSelector.addEventListener("change", () => {
    sortYearButton.style.display = "none"; // Mantener oculto el botón de año
    dateOrderButton.style.display = "inline-block"; // Mostrar solo el botón de orden ascendente/descendente
  });

  // Función para renderizar los resultados
  function renderResults(data, documentType) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = ""; // Limpiar los resultados anteriores

    // Verificar si hay resultados
    if (Array.isArray(data) && data.length > 0) {
      console.log("Número de resultados encontrados:", data.length);
      loadCards(data, documentType, true);
    } else {
      console.log("No se encontraron resultados para la búsqueda.");
      cardsContainer.innerHTML =
        "<p>No se encontraron resultados para la búsqueda.</p>";
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("date-order");
    button.addEventListener("click", function () {
        button.textContent = button.textContent === "Ascendente" ? "Descendente" : "Ascendente";
    });
});


//FUNCION PARA REALIZAR EL ORDENAMIENTO
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const typeSelector = document.getElementById("type-selector");
  const sortTitleButton = document.getElementById("sort-title");
  const sortAuthorButton = document.getElementById("sort-author");
  const sortYearButton = document.getElementById("sort-year");
  const dateOrderButton = document.getElementById("date-order");

  // Función para mostrar solo el botón de Año y Ascendente/Descendente
  function showYearAndOrderButtonsOnly() {
      sortTitleButton.style.display = "none";
      sortAuthorButton.style.display = "none";
      sortYearButton.style.display = "inline-block";
      dateOrderButton.style.display = "inline-block";
  }

  // Función para mostrar todos los botones de ordenamiento
  function showAllSortButtons() {
      sortTitleButton.style.display = "inline-block";
      sortAuthorButton.style.display = "inline-block";
      sortYearButton.style.display = "inline-block";
      dateOrderButton.style.display = "inline-block";
  }

  // Evento para el botón de búsqueda
  searchButton.addEventListener("click", showYearAndOrderButtonsOnly);

  // Evento para el combo box
  typeSelector.addEventListener("change", showAllSortButtons);
});



//Función para Obtener id_usuario de la Cookie
export async function getCookieValue(name) {
  const cookieString = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
  
  return cookieString ? cookieString.split('=')[1] : null;
}