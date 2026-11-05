/* =========================================================
   FOOD LOCAL - main.js
   Funciones compartidas en todas las páginas:
   - Abrir/cerrar el sidebar en móvil (botón, fondo oscuro,
     enlaces, tecla Escape) con estado accesible
   - Marcar el enlace activo según la página actual
   - Mostrar/activar el botón "volver arriba"
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* Marca que hay JS: solo entonces los elementos .revelar
     parten ocultos para aparecer al hacer scroll */
  document.documentElement.classList.add('js');

  /* ---------- Aparición al hacer scroll ---------- */
  var revelar = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    revelar.forEach(function (el) { observador.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Sidebar en móvil ---------- */
  var toggle  = document.querySelector('.topbar__toggle');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.fondo-oscurecido');

  function abrirSidebar() {
    sidebar.classList.add('abierta');
    overlay.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }

  function cerrarSidebar() {
    sidebar.classList.remove('abierta');
    overlay.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (toggle && sidebar && overlay) {
    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('abierta')) {
        cerrarSidebar();
      } else {
        abrirSidebar();
      }
    });

    // Cerrar al pulsar el fondo oscuro
    overlay.addEventListener('click', cerrarSidebar);

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && sidebar.classList.contains('abierta')) {
        cerrarSidebar();
        toggle.focus();
      }
    });

    // Cerrar al seleccionar una opción del menú
    sidebar.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', cerrarSidebar);
    });
  }

  /* ---------- Marcar enlace activo ---------- */
  var paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar__enlaces a').forEach(function (enlace) {
    if (enlace.getAttribute('href') === paginaActual) {
      enlace.classList.add('activo');
      enlace.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Botón "volver arriba" ---------- */
  var botonSubir = document.querySelector('.subir');

  if (botonSubir) {
    function revisarScroll() {
      if (window.scrollY > 320) {
        botonSubir.classList.add('visible');
      } else {
        botonSubir.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', revisarScroll, { passive: true });
    revisarScroll();

    botonSubir.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
