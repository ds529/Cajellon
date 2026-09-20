/* =========================================================
   CAJELLON - main.js
   Funciones compartidas en todas las páginas:
   - Abrir/cerrar el sidebar en móvil
   - Marcar el enlace activo según la página actual
   - Mostrar/activar el botón "volver al inicio de la página"
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sidebar en móvil ---------- */
  var toggle   = document.querySelector('.topbar__toggle');
  var sidebar  = document.querySelector('.sidebar');
  var overlay  = document.querySelector('.fondo-oscurecido');

  function abrirSidebar() {
    sidebar.classList.add('abierta');
    overlay.classList.add('visible');
  }
  function cerrarSidebar() {
    sidebar.classList.remove('abierta');
    overlay.classList.remove('visible');
  }

  if (toggle && sidebar && overlay) {
    toggle.addEventListener('click', abrirSidebar);
    overlay.addEventListener('click', cerrarSidebar);
    sidebar.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', cerrarSidebar);
    });
  }

  /* ---------- Marcar enlace activo ---------- */
  var paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar__enlaces a').forEach(function (enlace) {
    if (enlace.getAttribute('href') === paginaActual) {
      enlace.classList.add('activo');
    }
  });

  /* ---------- Botón "volver al inicio de la página" ---------- */
  var botonSubir = document.querySelector('.subir');

  if (botonSubir) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        botonSubir.classList.add('visible');
      } else {
        botonSubir.classList.remove('visible');
      }
    });

    botonSubir.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
