/* =========================================================
   CAJELLON - menu.js
   Lógica exclusiva de la página de menú:
   - Agregar / quitar platos del pedido
   - Calcular el total
   - Enviar el pedido (con especificaciones) a recepción
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var pedido = []; // { nombre, precio, cantidad }

  var listaPedido      = document.querySelector('.pedido-lista');
  var totalTexto        = document.querySelector('.pedido-total span:last-child');
  var botonEnviar        = document.querySelector('.enviar-pedido');
  var campoEspecificaciones = document.querySelector('#especificaciones');
  var campoNombre        = document.querySelector('#nombre-cliente');
  var campoMesa          = document.querySelector('#mesa-cliente');
  var mensajeConfirmacion = document.querySelector('.mensaje-confirmacion');

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

      // Pequeña animación de confirmación visual
      boton.classList.add('agregado');
      setTimeout(function () { boton.classList.remove('agregado'); }, 250);

      renderizarPedido();
    });
  });

  /* ---------- Dibujar el pedido en el panel lateral ---------- */
  function renderizarPedido() {
    listaPedido.innerHTML = '';

    if (pedido.length === 0) {
      listaPedido.innerHTML = '<p class="pedido-vacio">Aún no has agregado ningún plato.<br>Toca el botón “+” de un plato para añadirlo.</p>';
      totalTexto.textContent = '$0.00';
      return;
    }

    var total = 0;

    pedido.forEach(function (p, indice) {
      total += p.precio * p.cantidad;

      var fila = document.createElement('div');
      fila.className = 'pedido-item';
      fila.innerHTML =
        '<span><span class="pedido-item__cant">' + p.cantidad + 'x</span>' + p.nombre + '</span>' +
        '<span>$' + (p.precio * p.cantidad).toFixed(2) +
        ' <button class="pedido-item__quitar" data-indice="' + indice + '" title="Quitar"><i class="fa-solid fa-xmark"></i></button></span>';
      listaPedido.appendChild(fila);
    });

    totalTexto.textContent = '$' + total.toFixed(2);

    // Botones para quitar un plato del pedido
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

      // Reiniciar el pedido tras enviarlo
      pedido = [];
      renderizarPedido();
      if (campoEspecificaciones) campoEspecificaciones.value = '';
    });
  }

  renderizarPedido();
});
