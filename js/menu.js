/* =========================================================
   FOOD LOCAL - menu.js
   Lógica exclusiva de la página de menú:
   - Agregar platos al pedido, subir/bajar cantidades y quitarlos
   - Calcular el total y contar los platos
   - Enviar el pedido (con especificaciones) a recepción
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var pedido = []; // { nombre, precio, cantidad }

  var listaPedido         = document.querySelector('.pedido-lista');
  var totalTexto          = document.querySelector('.pedido-total span:last-child');
  var cuentaTexto         = document.querySelector('.pedido-cuenta');
  var botonEnviar         = document.querySelector('.enviar-pedido');
  var campoEspecificaciones = document.querySelector('#especificaciones');
  var campoNombre         = document.querySelector('#nombre-cliente');
  var campoMesa           = document.querySelector('#mesa-cliente');
  var mensajeConfirmacion = document.querySelector('.mensaje-confirmacion');

  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Agregar un plato al pedido ---------- */
  document.querySelectorAll('.plato-item__agregar').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var item = boton.closest('.plato-item');
      var nombre = item.getAttribute('data-nombre');
      var precio = parseFloat(item.getAttribute('data-precio'));

      var existente = pedido.find(function (p) { return p.nombre === nombre; });
      if (existente) {
        existente.cantidad += 1;
      } else {
        pedido.push({ nombre: nombre, precio: precio, cantidad: 1 });
      }

      // Confirmación visual en el propio botón: pasa a un "check" un instante
      var iconoOriginal = boton.innerHTML;
      boton.classList.add('agregado');
      boton.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(function () {
        boton.classList.remove('agregado');
        boton.innerHTML = iconoOriginal;
      }, 650);

      // Si había un mensaje de confirmación anterior, se oculta al armar otro pedido
      if (mensajeConfirmacion) {
        mensajeConfirmacion.classList.remove('visible');
        mensajeConfirmacion.textContent = '';
      }

      renderizarPedido();
    });
  });

  /* ---------- Dibujar el pedido en el panel lateral ---------- */
  function renderizarPedido() {
    listaPedido.innerHTML = '';

    var total = 0;
    var unidades = 0;
    pedido.forEach(function (p) {
      total += p.precio * p.cantidad;
      unidades += p.cantidad;
    });

    if (cuentaTexto) {
      cuentaTexto.textContent = pedido.length === 0
        ? 'Sin platos todavía'
        : unidades + (unidades === 1 ? ' plato en tu pedido' : ' platos en tu pedido');
    }

    if (pedido.length === 0) {
      listaPedido.innerHTML = '<p class="pedido-vacio">Aún no has agregado ningún plato.<br>Toca el botón “+” de un plato para añadirlo.</p>';
      totalTexto.textContent = '$0.00';
      return;
    }

    pedido.forEach(function (p, indice) {
      var fila = document.createElement('div');
      fila.className = 'pedido-item';
      fila.innerHTML =
        '<span class="pedido-item__nombre"><span class="pedido-item__cant">' + p.cantidad + 'x</span>' + escaparHTML(p.nombre) + '</span>' +
        '<span class="pedido-item__controles">' +
          '<button class="pedido-item__menos" data-indice="' + indice + '" aria-label="Quitar una unidad de ' + escaparHTML(p.nombre) + '"><i class="fa-solid fa-minus"></i></button>' +
          '<button class="pedido-item__mas" data-indice="' + indice + '" aria-label="Añadir una unidad de ' + escaparHTML(p.nombre) + '"><i class="fa-solid fa-plus"></i></button>' +
          '<span class="pedido-item__precio">$' + (p.precio * p.cantidad).toFixed(2) + '</span>' +
          '<button class="pedido-item__quitar" data-indice="' + indice + '" aria-label="Quitar ' + escaparHTML(p.nombre) + ' del pedido"><i class="fa-solid fa-xmark"></i></button>' +
        '</span>';
      listaPedido.appendChild(fila);
    });

    totalTexto.textContent = '$' + total.toFixed(2);

    // Controles de cantidad y quitar, recién dibujados
    listaPedido.querySelectorAll('.pedido-item__menos').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-indice'), 10);
        pedido[i].cantidad -= 1;
        if (pedido[i].cantidad <= 0) pedido.splice(i, 1);
        renderizarPedido();
      });
    });

    listaPedido.querySelectorAll('.pedido-item__mas').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-indice'), 10);
        pedido[i].cantidad += 1;
        renderizarPedido();
      });
    });

    listaPedido.querySelectorAll('.pedido-item__quitar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-indice'), 10);
        pedido.splice(i, 1);
        renderizarPedido();
      });
    });
  }

  /* ---------- Enviar el pedido a recepción ---------- */
  if (botonEnviar) {
    botonEnviar.addEventListener('click', function () {

      if (pedido.length === 0) {
        alert('Agrega al menos un plato antes de enviar tu pedido.');
        return;
      }

      var resumen = pedido.map(function (p) {
        return p.cantidad + 'x ' + p.nombre;
      }).join(', ');

      var especificaciones = campoEspecificaciones ? campoEspecificaciones.value.trim() : '';
      var nombreCliente = campoNombre ? campoNombre.value.trim() : '';
      var mesa = campoMesa ? campoMesa.value.trim() : '';

      // En un sitio en producción, aquí se enviaría el pedido al servidor
      // de recepción (fetch/AJAX). Se deja simulado localmente:
      var pedidoFinal = {
        cliente: nombreCliente || 'Sin nombre',
        mesa: mesa || 'No indicada',
        platos: pedido,
        especificaciones: especificaciones || 'Ninguna',
        fecha: new Date().toLocaleString()
      };

      console.log('Pedido enviado a recepción:', pedidoFinal);

      // Mensaje de confirmación visual para el cliente
      if (mensajeConfirmacion) {
        mensajeConfirmacion.textContent =
          '¡Pedido enviado a recepción! Resumen: ' + resumen +
          (especificaciones ? ' — Especificaciones: ' + especificaciones : '');
        mensajeConfirmacion.classList.add('visible');
      }

      // Reiniciar el pedido tras enviarlo (nombre y entrega se conservan)
      pedido = [];
      renderizarPedido();
      if (campoEspecificaciones) campoEspecificaciones.value = '';
    });
  }

  renderizarPedido();
});
