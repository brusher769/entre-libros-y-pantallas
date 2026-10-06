/* Interruptor papel / pantalla
   - Guarda la elección del lector en su navegador.
   - Sincroniza el tema de los comentarios (Giscus). */

(function () {
  var CLAVE = "modo-lectura";
  var raiz = document.documentElement;

  var TEMA_GISCUS = {
    papel: "light",
    pantalla: "transparent_dark"
  };

  function guardar(modo) {
    try { localStorage.setItem(CLAVE, modo); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }

  function actualizarGiscus(modo) {
    var iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: TEMA_GISCUS[modo] } } },
      "https://giscus.app"
    );
  }

  function aplicar(modo) {
    raiz.setAttribute("data-modo", modo);
    var boton = document.getElementById("interruptor");
    if (boton) {
      boton.setAttribute("aria-pressed", modo === "pantalla" ? "true" : "false");
      boton.setAttribute(
        "aria-label",
        modo === "pantalla" ? "Cambiar a modo papel" : "Cambiar a modo pantalla"
      );
    }
    actualizarGiscus(modo);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var boton = document.getElementById("interruptor");
    aplicar(raiz.getAttribute("data-modo") || "papel");

    if (boton) {
      boton.addEventListener("click", function () {
        var nuevo = raiz.getAttribute("data-modo") === "pantalla" ? "papel" : "pantalla";
        aplicar(nuevo);
        guardar(nuevo);
      });
    }

    // Carga los comentarios con el tema del modo actual
    var contenedor = document.getElementById("giscus");
    if (contenedor) {
      var s = document.createElement("script");
      s.src = "https://giscus.app/client.js";
      var cfg = contenedor.dataset;
      s.setAttribute("data-repo", cfg.repo);
      s.setAttribute("data-repo-id", cfg.repoId);
      s.setAttribute("data-category", cfg.category);
      s.setAttribute("data-category-id", cfg.categoryId);
      s.setAttribute("data-mapping", "pathname");
      s.setAttribute("data-strict", "0");
      s.setAttribute("data-reactions-enabled", "1");
      s.setAttribute("data-emit-metadata", "0");
      s.setAttribute("data-input-position", "top");
      s.setAttribute("data-theme", TEMA_GISCUS[raiz.getAttribute("data-modo") || "papel"]);
      s.setAttribute("data-lang", "es");
      s.setAttribute("data-loading", "lazy");
      s.crossOrigin = "anonymous";
      s.async = true;
      contenedor.appendChild(s);
    }
  });
})();
