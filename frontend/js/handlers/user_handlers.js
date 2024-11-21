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


  let  usuarioId = getCookieValue('id_usuario');