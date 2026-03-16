/* ═══════════════════════════════════════════════════════
   ARCHIVO: js/utilidades.js
   PROPÓSITO: Funciones auxiliares reutilizables.
   Estas funciones son usadas por ui.js y no contienen
   lógica de negocio — solo ayudan con el DOM y el formato.
   ═══════════════════════════════════════════════════════ */


/**
 * Muestra un mensaje en un cuadro de resultado (result-box).
 * @param {string} id   - ID del elemento HTML destino.
 * @param {string} msg  - Texto a mostrar.
 * @param {string} tipo - Estilo: 'ok', 'err', 'warn', 'info'.
 */
function setResultado(id, msg, tipo = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className   = 'result-box' + (tipo ? ' ' + tipo : '');
}


/**
 * Lee y limpia el valor de texto de un input.
 * @param {string} id - ID del campo input.
 * @returns {string}
 */
function leerTexto(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}


/**
 * Lee el valor numérico de un input.
 * @param {string} id - ID del campo input.
 * @returns {number}
 */
function leerNumero(id) {
  return parseFloat(document.getElementById(id)?.value || '');
}


/**
 * Limpia los campos de una lista de inputs.
 * @param {string[]} ids - Array de IDs a limpiar.
 */
function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


/**
 * Limpia un <select> y agrega la opción placeholder inicial.
 * @param {string} selectId
 * @param {string} placeholder
 */
function resetSelect(selectId, placeholder) {
  const sel = document.getElementById(selectId);
  if (sel) sel.innerHTML = `<option value="">${placeholder}</option>`;
}


/**
 * Agrega una opción al final de un <select>.
 * @param {string} selectId
 * @param {string|number} valor
 * @param {string} texto
 */
function addOpcion(selectId, valor, texto) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const opt       = document.createElement('option');
  opt.value       = valor;
  opt.textContent = texto;
  sel.appendChild(opt);
}


/**
 * Formatea un número como moneda: $0.00
 * @param {number} n
 * @returns {string}
 */
function $$(n) {
  return '$' + Number(n).toFixed(2);
}


/**
 * Muestra una notificación tipo toast en la esquina inferior derecha.
 * @param {string} mensaje
 * @param {'ok'|'err'|'warn'|'info'} tipo
 */
function toast(mensaje, tipo = 'ok') {
  const t = document.getElementById('toast');
  const i = document.getElementById('toast-icon');
  const m = document.getElementById('toast-msg');

  const iconos  = {
    ok:   'bi-check-circle-fill',
    err:  'bi-x-circle-fill',
    warn: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };
  const colores = {
    ok:   '#34d399',
    err:  '#f87171',
    warn: '#fbbf24',
    info: '#4f8ef7'
  };

  i.className    = 'bi ' + iconos[tipo];
  i.style.color  = colores[tipo];
  m.textContent  = mensaje;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}


/**
 * Controla la navegación entre secciones (SPA).
 * Oculta todas las secciones y muestra solo la seleccionada.
 * @param {string} secId - ID de la sección a mostrar.
 * @param {HTMLElement} btn - Botón de navegación pulsado.
 */
function navegar(secId, btn) {
  // Ocultar todas las secciones
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  // Desactivar todos los botones del nav
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  // Mostrar la sección seleccionada
  document.getElementById(secId).classList.add('active');
  // Marcar el botón como activo
  btn.classList.add('active');
  // Scroll suave al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}