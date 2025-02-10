import { loadCards } from "./handlers/card_handler.js";
import {
  getAllDocuments,
  getDocumentById,
  getDocumentsByType,
  searchDocuments,
} from "./services/api_service.js";
import { loadNavbar } from "./services/navbar_service.js";
import { API_URL } from "../../config.js";

import * as Swal from "/node_modules/sweetalert2/dist/sweetalert2.js";

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
let sortBy = "anio_publicacion";
let sortOrder = "asc";
let isSearchMode = false;

const searchButton = document.getElementById("search-button");
const typeSelector = document.getElementById("type-selector");
const sortTitleButton = document.getElementById("sort-title");
const sortAuthorButton = document.getElementById("sort-author");
const sortYearButton = document.getElementById("sort-year");
const dateOrderButton = document.getElementById("date-order");

const keywordsInput = document.getElementById("keywords");
const authorInput = document.getElementById("author");
const startYearInput = document.getElementById("date-start");
const endYearInput = document.getElementById("date-end");
const publicationDateInput = document.getElementById("publication-date");

//FUNCION PARA CAMBIAR NOMBRE DE ASC/DESC
function toggleSortOrder() {
  sortOrder = sortOrder === "asc" ? "desc" : "asc";
  document.getElementById("date-order").innerText =
    sortOrder === "asc" ? "Ascendente" : "Descendente";
  console.log("ACTUALIZA POR ORDEN EL NOMBRE", sortOrder);

  if (isSearchMode) {
    executeSearch(
      keywordsInput.value.trim(),
      startYearInput.value,
      endYearInput.value,
      authorInput.value.trim(),
      typeSelector.value,
    );
  } else {
    fetchAndRenderDocuments();
  }
}

// FUNCION PARA CONTROLAR ESTADOS DE LSO BOTONES
function handleSortButtonClick(field) {
  sortBy = field;
  if (isSearchMode) {
    executeSearch(
      keywordsInput.value.trim(),
      startYearInput.value,
      endYearInput.value,
      authorInput.value.trim(),
      typeSelector.value,
    );
  } else {
    fetchAndRenderDocuments();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Si hay un tipo previamente seleccionado, restablecerlo y cargar documentos.
  if (selectedType) {
    console.log("Restableciendo el tipo seleccionado:", selectedType);
    typeSelector.value = selectedType;
    isSearchMode = false;
    await fetchAndRenderDocuments();
  }

  // Manejar el cambio de selección del tipo de documento.
  typeSelector.addEventListener("change", async () => {
    selectedType = typeSelector.value;
    console.log("Tipo seleccionado:", selectedType);

    keywordsInput.value = "";
    authorInput.value = "";
    startYearInput.value = "";
    endYearInput.value = "";
    publicationDateInput.value = "";

    isSearchMode = false;
    currentPage = 1;
    await fetchAndRenderDocuments();
  });

  // Configurar los eventos de los botones de ordenamiento
  document
    .getElementById("sort-title")
    .addEventListener("click", () => handleSortButtonClick("titulo"));
  document
    .getElementById("sort-author")
    .addEventListener("click", () => handleSortButtonClick("autores"));
  document
    .getElementById("sort-year")
    .addEventListener("click", () => handleSortButtonClick("anio_publicacion"));

  // Configurar el evento del botón de orden ascendente/descendente
  document.getElementById("date-order").addEventListener("click", () => {
    toggleSortOrder();
    console.log("ACTUALIZA POR ORDEN SE LLAMA A LA FUNCION");
  });

  // Configurar los eventos de los botones de paginación.
  document.getElementById("prev-page").addEventListener("click", prevPage);
  document.getElementById("next-page").addEventListener("click", nextPage);
});

// Función para obtener y renderizar documentos
export async function fetchAndRenderDocuments() {
  isSearchMode = false;
  console.log("Ejecutando fetchAndRenderDocuments con los parámetros:", {
    currentPage,
    itemsPerPage,
    selectedType,
    sortBy,
    sortOrder,
  });
  try {
    console.log(`Obteniendo documentos en orden ${sortOrder}`);
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
  let keywords = keywordsInput.value.trim() ? keywordsInput.value.trim() : ""; // Verifica y ajusta el valor
  if (isSearchMode) {
    executeSearch(
      keywordsInput.value.trim(),
      startYearInput.value,
      endYearInput.value,
      authorInput.value.trim(),
      typeSelector.value,
    );
  } else {
    fetchAndRenderDocuments();
  }
}

// Función para ir a la página anterior
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    let keywords = keywordsInput.value.trim() ? keywordsInput.value.trim() : ""; // Verifica y ajusta el valor
    if (isSearchMode) {
      executeSearch(
        keywordsInput.value.trim(),
        startYearInput.value,
        endYearInput.value,
        authorInput.value.trim(),
        typeSelector.value,
      );
    } else {
      fetchAndRenderDocuments();
    }
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
      Sweetalert2.fire("El tipo de documento no está disponible.");
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
    const archivoUrl = `${API_URL}/file-handler/file${nombreArchivo}`;
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

  // Función para obtener el valor de una cookie
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  }

  // Función para actualizar el tema en el servidor
  async function updateThemeOnServer(idUsuario, theme) {
    try {
      const response = await fetch(`${API_URL}/usuarios/update-theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_usuario: idUsuario, theme }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el tema: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message); // Confirmación del servidor
    } catch (error) {
      console.error("Error al sincronizar el tema con el servidor:", error);
    }
  }

  // Cargar el componente de navegación
  fetch("../components/menu_navegacion.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("menu-container").innerHTML = data;

      // Agregar el event listener para el botón de cambio de tema
      const themeToggleButton = document.getElementById("theme-toggle");
      if (themeToggleButton) {
        console.log("Botón de cambio de tema encontrado");
        themeToggleButton.addEventListener("click", function () {
          const currentTheme = body.getAttribute("data-theme");
          const newTheme = currentTheme === "light" ? "dark" : "light";
          body.setAttribute("data-theme", newTheme);

          // Actualizar la cookie del tema
          document.cookie = `theme=${newTheme}; path=/; max-age=86400`;

          // Sincronizar el tema con el servidor
          const userId = getCookie("id_usuario");
          if (userId) {
            const themeValue = newTheme === "light" ? 1 : 0;
            updateThemeOnServer(userId, themeValue);
          }

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

// Función para renderizar los resultados
function renderResults(data, documentType) {
  const cardsContainer = document.getElementById("cards-container");
  const nextPageButton = document.getElementById("next-page");
  const prevPageButton = document.getElementById("prev-page");
  const pageInfo = document.getElementById("page-info");

  cardsContainer.innerHTML = ""; // Limpiar los resultados anteriores

  // Verificar si hay resultados
  if (Array.isArray(data) && data.length > 0) {
    console.log("Número de resultados encontrados:", data.length);

    // Renderiza las tarjetas
    loadCards(data, documentType, true);

    // Mostrar los controles de paginación
    document.getElementById("pagination-controls").style.display = "block";

    // Mostrar u ocultar el botón "Siguiente"
    nextPageButton.style.display =
      data.length < itemsPerPage ? "none" : "inline-block";

    // Mostrar u ocultar el botón "Anterior"
    prevPageButton.style.display = currentPage === 1 ? "none" : "inline-block";

    // Actualizar la información de la página actual
    pageInfo.innerText = `Página ${currentPage}`;
  } else {
    console.log("No se encontraron resultados para la búsqueda.");

    // Mostrar mensaje de que no se encontraron resultados
    cardsContainer.innerHTML =
      "<p>No se encontraron resultados para la búsqueda.</p>";

    // Ocultar los controles de paginación
    document.getElementById("pagination-controls").style.display = "none";
  }
}

//FUNCION DE BUSQUEDA
async function executeSearch(
  query,
  anio_inicio,
  anio_fin,
  autores,
  tipo_documento
) {
  isSearchMode = true;

  console.log("Ejecutando búsqueda con los siguientes parámetros:", {
    query,
    currentPage,
    itemsPerPage,
    anio_inicio,
    anio_fin,
    autores,
    tipo_documento,
    sortBy,
    sortOrder,
  });

  try {
    const data = await searchDocuments(
      query,
      currentPage,
      itemsPerPage,
      anio_inicio,
      anio_fin,
      autores,
      tipo_documento,
      sortBy,
      sortOrder
    );

    console.log("Datos recibidos del backend:", data);

    // Renderizar los resultados obtenidos
    renderResults(data, tipo_documento);
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
    alert(
      "Hubo un error al realizar la búsqueda. Por favor, inténtelo de nuevo."
    );
  }
}

//BUSQUEDA
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = new Date().getFullYear();

  // Botones de ordenamiento
  const sortTitleButton = document.getElementById("sort-title");
  const sortAuthorButton = document.getElementById("sort-author");
  const sortYearButton = document.getElementById("sort-year");
  const dateOrderButton = document.getElementById("date-order");

  console.log("ORDENAMINETO POR FECHA", dateOrderButton);
  console.log("ORDENAMINETO POR TITULO", sortTitleButton);
  console.log("ORDENAMINETO POR AUTOR", sortAuthorButton);
  console.log("ORDENAMINETO POR AÑO", sortYearButton);

  if (!dateOrderButton) {
    console.error("El botón dateOrderButton no existe en el DOM.");
  }

  // Manejar el evento de clic del botón de búsqueda
  searchButton.addEventListener("click", async () => {
    const documentType = typeSelector.value;
    let query = ""; // Palabra clave (obligatoria)
    const author = authorInput.value.trim();
    const anio_inicio = startYearInput.value.trim();
    const anio_fin = endYearInput.value.trim();

    console.log("valor keyword: " + keywordsInput.value);

    if (keywordsInput.value != "") {
      query = keywordsInput.value.trim();
    }

    isSearchMode = true;
    sortBy = "anio_publicacion";

    // Validar que se ingrese una palabra clave
    /*if (!query) {
      Sweetalert2.fire(
        "Por favor, ingrese una palabra clave para realizar la búsqueda."
      );
      return;
    }*/

    //if (anio_publicacion) {
    //  if (
    //    isNaN(anio_publicacion) ||
    //    anio_publicacion < 1900 ||
    //    anio_publicacion > currentYear
    //  ) {
    //    Sweetalert2.fire(`Por favor, ingrese un año entre 1900 y ${currentYear}.`);
    //    publicationDateInput.value = "";
    //    return;
    //  }
    //}

    if (
      anio_inicio &&
      (isNaN(anio_inicio) || anio_inicio < 1900 || anio_inicio > currentYear)
    ) {
      Sweetalert2.fire(
        `Por favor, ingrese un año de inicio entre 1900 y ${currentYear}.`
      );
      startYearInput.value = "";
      return;
    }

    if (
      anio_fin &&
      (isNaN(anio_fin) || anio_fin < 1900 || anio_fin > currentYear)
    ) {
      Sweetalert2.fire(
        `Por favor, ingrese un año de fin entre 1900 y ${currentYear}.`
      );
      endYearInput.value = "";
      return;
    }

    if (anio_inicio && anio_fin && anio_inicio > anio_fin) {
      Sweetalert2.fire(
        "El año de inicio no puede ser mayor que el año de fin."
      );
      return;
    }

    currentPage = 1;
    await executeSearch(query, anio_inicio, anio_fin, author, documentType);
  });

  // Función para ejecutar la búsqueda
  

  dateOrderButton.innerHTML = "Cambiar Orden";

  // Al seleccionar una nueva opción en el combobox, se muestran todos los botones
  typeSelector.addEventListener("change", () => {
    sortYearButton.style.display = "none"; // Mantener oculto el botón de año
    dateOrderButton.style.display = "inline-block"; // Mostrar solo el botón de orden ascendente/descendente
    isSearchMode = false;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("date-order");
  button.addEventListener("click", function () {
    button.textContent =
      button.textContent === "Ascendente" ? "Descendente" : "Ascendente";
  });
});

//FUNCION PARA REALIZAR EL ORDENAMIENTO
document.addEventListener("DOMContentLoaded", () => {
  // Función para mostrar todos los botones de ordenamiento
  function showAllSortButtons() {
    sortTitleButton.style.display = "inline-block";
    sortAuthorButton.style.display = "none";
    sortYearButton.style.display = "inline-block";
    dateOrderButton.style.display = "inline-block";
  }

  // Evento para el botón de búsqueda
  searchButton.addEventListener("click", showAllSortButtons);

  // Evento para el combo box
  typeSelector.addEventListener("change", showAllSortButtons);
});

//Función para Obtener id_usuario de la Cookie
export async function getCookieValue(name) {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));

  return cookieString ? cookieString.split("=")[1] : null;
}
