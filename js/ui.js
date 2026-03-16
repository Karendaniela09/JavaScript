/* ═══════════════════════════════════════════════════════
   ARCHIVO: js/ui.js
   PROPÓSITO: Módulos de interfaz (manipulación del DOM).
   Cada módulo UI_X conecta los formularios HTML con
   las clases de clases.js usando las funciones de
   utilidades.js. NO contiene lógica de negocio.
   ═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   MÓDULO UI — BANCO (Problema 1)
   ───────────────────────────────────────────── */
const UI_Banco = {

  crearCuenta() {
    const titular = leerTexto('b-nombre');
    const saldo   = leerNumero('b-saldo') || 0;
    if (!titular) {
      setResultado('b-res-crear', 'Ingresa el nombre del titular.', 'err');
      toast('Nombre requerido', 'err');
      return;
    }
    const c = banco.crearCuenta(titular, saldo);
    setResultado('b-res-crear',
      `Cuenta #${c.id} creada para ${c.titular}.\nSaldo inicial: ${$$(saldo)}`, 'ok');
    toast(`Cuenta #${c.id} creada ✔`, 'ok');
    limpiarCampos(['b-nombre', 'b-saldo']);
    this._refrescarSelect();
    this._renderTabla();
  },

  depositar() {
    const c = this._getCuenta(); if (!c) return;
    const m = leerNumero('b-monto');
    try {
      setResultado('b-res-op', c.depositar(m), 'ok');
      toast(`Depósito de ${$$(m)} realizado`, 'ok');
    } catch (e) {
      setResultado('b-res-op', e.message, 'err');
      toast(e.message.split('\n')[0], 'err');
    }
    this._refrescarSelect();
    this._renderTabla();
  },

  retirar() {
    const c = this._getCuenta(); if (!c) return;
    const m = leerNumero('b-monto');
    try {
      setResultado('b-res-op', c.retirar(m), 'warn');
      toast(`Retiro de ${$$(m)} realizado`, 'warn');
    } catch (e) {
      setResultado('b-res-op', e.message, 'err');
      toast(e.message.split('\n')[0], 'err');
    }
    this._refrescarSelect();
    this._renderTabla();
  },

  consultarSaldo() {
    const c = this._getCuenta(); if (!c) return;
    setResultado('b-res-op', c.consultarSaldo(), 'info');
  },

  _getCuenta() {
    const id = document.getElementById('b-sel').value;
    if (!id) {
      setResultado('b-res-op', 'Selecciona una cuenta.', 'err');
      toast('Selecciona una cuenta', 'err');
      return null;
    }
    return banco.obtenerCuenta(id);
  },

  _refrescarSelect() {
    resetSelect('b-sel', '— Selecciona una cuenta —');
    banco.listarCuentas().forEach(c =>
      addOpcion('b-sel', c.id, `#${c.id} — ${c.titular} (${$$(c.saldo)})`)
    );
  },

  _renderTabla() {
    const tbody   = document.getElementById('b-tbody');
    const cuentas = banco.listarCuentas();
    tbody.innerHTML = cuentas.length === 0
      ? '<tr><td colspan="4" style="text-align:center;color:var(--ink-3);padding:1.5rem">Sin cuentas registradas</td></tr>'
      : cuentas.map(c => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace">#${c.id}</td>
            <td>${c.titular}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:var(--c2)">${$$(c.saldo)}</td>
            <td><span class="badge bb">${c.movimientos}</span></td>
          </tr>`).join('');
  }
};


/* ─────────────────────────────────────────────
   MÓDULO UI — INVENTARIO (Problema 2)
   ───────────────────────────────────────────── */
const UI_Inventario = {

  agregar() {
    const nombre   = leerTexto('inv-nombre');
    const precio   = leerNumero('inv-precio');
    const cantidad = parseInt(document.getElementById('inv-cant')?.value || '');
    if (!nombre || isNaN(precio) || isNaN(cantidad) || precio < 0 || cantidad < 0) {
      setResultado('inv-res', 'Completa todos los campos con valores válidos.', 'err');
      return;
    }
    const p = inventario.registrarProducto(nombre, precio, cantidad);
    setResultado('inv-res',
      `"${p.nombre}" registrado.\nPrecio: ${$$(p.precio)} — Stock: ${p.cantidad}`, 'ok');
    toast(`"${p.nombre}" agregado ✔`, 'ok');
    limpiarCampos(['inv-nombre', 'inv-precio', 'inv-cant']);
    this._refrescarSelect();
    this._renderTabla();
    this._actualizarTotal();
  },

  consultar() {
    const id = document.getElementById('inv-sel').value;
    if (!id) {
      setResultado('inv-res-det', 'Selecciona un producto.', 'err');
      return;
    }
    setResultado('inv-res-det', inventario.obtenerProducto(id).obtenerInfo(), 'info');
  },

  _refrescarSelect() {
    resetSelect('inv-sel', '— Selecciona —');
    inventario.listarProductos().forEach(p =>
      addOpcion('inv-sel', p.id, p.nombre)
    );
  },

  _actualizarTotal() {
    document.getElementById('inv-total').textContent =
      $$(inventario.calcularValorTotalInventario());
  },

  _renderTabla() {
    const tbody = document.getElementById('inv-tbody');
    const prods = inventario.listarProductos();
    tbody.innerHTML = prods.length === 0
      ? '<tr><td colspan="5" style="text-align:center;color:var(--ink-3);padding:1.5rem">Sin productos registrados</td></tr>'
      : prods.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td style="font-family:'JetBrains Mono',monospace">${$$(p.precio)}</td>
            <td>${p.cantidad}</td>
            <td style="font-family:'JetBrains Mono',monospace;color:var(--c2)">${$$(p.calcularValorTotal())}</td>
          </tr>`).join('');
  }
};


/* ─────────────────────────────────────────────
   MÓDULO UI — ESTUDIANTES (Problema 3)
   ───────────────────────────────────────────── */
const UI_Estudiantes = {

  registrar() {
    const nombre     = leerTexto('est-nombre');
    const codigo     = leerTexto('est-cod');
    const asignatura = leerTexto('est-asig');
    const nota       = leerNumero('est-nota');
    if (!nombre || !codigo || !asignatura || isNaN(nota)) {
      setResultado('est-res', 'Completa todos los campos.', 'err');
      return;
    }
    if (nota < 0 || nota > 5) {
      setResultado('est-res', 'La nota debe estar entre 0.0 y 5.0.', 'err');
      return;
    }
    const e = registro.registrar(nombre, codigo, asignatura, nota);
    setResultado('est-res',
      `${e.nombre} registrado.\nNota: ${nota.toFixed(1)} → ${e.aprobo() ? 'APROBÓ ✔' : 'REPROBÓ ✖'}`,
      e.aprobo() ? 'ok' : 'warn');
    toast(`${e.nombre} — ${e.aprobo() ? 'APROBÓ' : 'REPROBÓ'}`, e.aprobo() ? 'ok' : 'warn');
    limpiarCampos(['est-nombre', 'est-cod', 'est-asig', 'est-nota']);
    this._refrescarSelect();
    this._renderTabla();
    this._actualizarStats();
  },

  verDetalle() {
    const id = document.getElementById('est-sel').value;
    if (!id) {
      setResultado('est-res-det', 'Selecciona un estudiante.', 'err');
      return;
    }
    const e = registro.obtenerEstudiante(id);
    setResultado('est-res-det', e.obtenerInfo(), e.aprobo() ? 'ok' : 'warn');
  },

  _refrescarSelect() {
    resetSelect('est-sel', '— Selecciona —');
    registro.listarEstudiantes().forEach(e =>
      addOpcion('est-sel', e.id, `${e.nombre} (${e.codigo})`)
    );
  },

  _actualizarStats() {
    const s = registro.calcularEstadisticas();
    document.getElementById('e-total').textContent = s.total;
    document.getElementById('e-apro').textContent  = s.aprobados;
    document.getElementById('e-repr').textContent  = s.reprobados;
    document.getElementById('e-prom').textContent  = s.promedio;
  },

  _renderTabla() {
    const tbody = document.getElementById('est-tbody');
    const lista = registro.listarEstudiantes();
    tbody.innerHTML = lista.length === 0
      ? '<tr><td colspan="5" style="text-align:center;color:var(--ink-3);padding:1.5rem">Sin estudiantes registrados</td></tr>'
      : lista.map(e => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace;font-size:.76rem">${e.codigo}</td>
            <td>${e.nombre}</td>
            <td>${e.asignatura}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-weight:700">${e.nota.toFixed(1)}</td>
            <td><span class="badge ${e.aprobo() ? 'bg' : 'br'}">${e.aprobo() ? 'APROBÓ' : 'REPROBÓ'}</span></td>
          </tr>`).join('');
  }
};


/* ─────────────────────────────────────────────
   MÓDULO UI — CARRITO (Problema 4)
   ───────────────────────────────────────────── */
const UI_Carrito = {

  agregar() {
    const nombre = leerTexto('cart-nom');
    const precio = leerNumero('cart-pre');
    if (!nombre || isNaN(precio) || precio <= 0) {
      setResultado('cart-res', 'Nombre y precio válidos son requeridos.', 'err');
      return;
    }
    const item = carrito.agregarProducto(nombre, precio);
    setResultado('cart-res',
      `"${item.nombre}" agregado.\nPrecio: ${$$(precio)}`, 'ok');
    toast(`"${item.nombre}" en el carrito`, 'ok');
    limpiarCampos(['cart-nom', 'cart-pre']);
    this._renderCarrito();
  },

  eliminarItem(id) {
    try {
      const item = carrito.eliminarProducto(id);
      setResultado('cart-res', `"${item.nombre}" eliminado del carrito.`, 'warn');
      toast(`"${item.nombre}" eliminado`, 'warn');
      this._renderCarrito();
    } catch (e) {
      setResultado('cart-res', e.message, 'err');
    }
  },

  vaciar() {
    if (carrito.listarItems().length === 0) {
      setResultado('cart-res', 'El carrito ya está vacío.', 'err');
      return;
    }
    carrito.vaciar();
    setResultado('cart-res', 'Carrito vaciado correctamente.', 'warn');
    toast('Carrito vaciado', 'warn');
    this._renderCarrito();
  },

  _renderCarrito() {
    const cont  = document.getElementById('cart-items');
    const items = carrito.listarItems();
    document.getElementById('cart-count').textContent =
      `${items.length} item${items.length !== 1 ? 's' : ''}`;
    if (items.length === 0) {
      cont.innerHTML =
        '<div class="empty-state"><i class="bi bi-cart-x"></i>El carrito está vacío</div>';
      document.getElementById('cart-total').textContent = '$0.00';
      return;
    }
    cont.innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <div class="ci-name">${item.nombre}</div>
          <div class="ci-price">${$$(item.precio)}</div>
        </div>
        <button class="btn btn-danger btn-sm"
          onclick="UI_Carrito.eliminarItem(${item.id})" title="Eliminar">
          <i class="bi bi-trash3"></i>
        </button>
      </div>`).join('');
    document.getElementById('cart-total').textContent = $$(carrito.calcularTotal());
  }
};


/* ─────────────────────────────────────────────
   MÓDULO UI — VEHÍCULOS (Problema 5)
   ───────────────────────────────────────────── */
const UI_Vehiculos = {

  registrar() {
    const placa  = leerTexto('veh-placa');
    const modelo = leerTexto('veh-modelo');
    const vmax   = parseInt(document.getElementById('veh-vmax')?.value || '');
    if (!placa || !modelo || isNaN(vmax) || vmax <= 0) {
      setResultado('veh-res', 'Completa todos los campos.', 'err');
      return;
    }
    const v = flota.registrar(placa, modelo, vmax);
    setResultado('veh-res',
      `Vehículo ${v.placa} registrado.\nModelo: ${v.modelo} — Vel. máx: ${v.velocidadMaxima} km/h`, 'ok');
    toast(`Vehículo ${v.placa} registrado`, 'ok');
    limpiarCampos(['veh-placa', 'veh-modelo', 'veh-vmax']);
    this._refrescarSelect();
    this._renderTabla();
  },

  seleccionar() {
    const v = this._getVehiculo();
    if (v) this._actualizarDisplay(v);
  },

  acelerar() {
    const v = this._getVehiculo(); if (!v) return;
    const inc = parseInt(document.getElementById('veh-inc')?.value || '10') || 10;
    try {
      setResultado('veh-estado', v.acelerar(inc), 'ok');
      toast(`+${inc} km/h`, 'ok');
    } catch (e) { setResultado('veh-estado', e.message, 'err'); }
    this._actualizarDisplay(v);
    this._renderTabla();
  },

  frenar() {
    const v = this._getVehiculo(); if (!v) return;
    const dec = parseInt(document.getElementById('veh-inc')?.value || '10') || 10;
    try {
      setResultado('veh-estado', v.frenar(dec), 'warn');
      toast(`−${dec} km/h`, 'warn');
    } catch (e) { setResultado('veh-estado', e.message, 'err'); }
    this._actualizarDisplay(v);
    this._renderTabla();
  },

  detener() {
    const v = this._getVehiculo(); if (!v) return;
    setResultado('veh-estado', v.detener(), 'ok');
    toast(`${v.placa} detenido`, 'ok');
    this._actualizarDisplay(v);
    this._renderTabla();
  },

  _getVehiculo() {
    const id = document.getElementById('veh-sel').value;
    if (!id) {
      setResultado('veh-estado', 'Selecciona un vehículo.', 'err');
      return null;
    }
    return flota.obtener(id);
  },

  _actualizarDisplay(v) {
    const colores = {
      'DETENIDO' : 'var(--ink-3)',
      'EN MARCHA': 'var(--c2)',
      'VEL. MÁX' : 'var(--c5)'
    };
    const bclass = {
      'DETENIDO' : 'bgr',
      'EN MARCHA': 'bg',
      'VEL. MÁX' : 'br'
    };
    const estado = v.obtenerEstado();
    const speedEl = document.getElementById('veh-speed');
    speedEl.textContent = v.velocidadActual;
    speedEl.style.color = colores[estado];
    document.getElementById('veh-bar').style.width =
      v.porcentajeVelocidad() + '%';
    document.getElementById('veh-estado-badge').innerHTML =
      `<span class="badge ${bclass[estado]}">${estado}</span>`;
  },

  _refrescarSelect() {
    resetSelect('veh-sel', '— Selecciona —');
    flota.listar().forEach(v =>
      addOpcion('veh-sel', v.id, `${v.placa} — ${v.modelo}`)
    );
  },

  _renderTabla() {
    const bclass = {
      'DETENIDO' : 'bgr',
      'EN MARCHA': 'bg',
      'VEL. MÁX' : 'br'
    };
    const tbody = document.getElementById('veh-tbody');
    const lista = flota.listar();
    tbody.innerHTML = lista.length === 0
      ? '<tr><td colspan="5" style="text-align:center;color:var(--ink-3);padding:1.5rem">Sin vehículos registrados</td></tr>'
      : lista.map(v => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace">${v.placa}</td>
            <td>${v.modelo}</td>
            <td style="font-family:'JetBrains Mono',monospace">${v.velocidadActual} km/h</td>
            <td style="font-family:'JetBrains Mono',monospace">${v.velocidadMaxima} km/h</td>
            <td><span class="badge ${bclass[v.obtenerEstado()]}">${v.obtenerEstado()}</span></td>
          </tr>`).join('');
  }
};


/* ─────────────────────────────────────────────
   MÓDULO UI — BIBLIOTECA (Problema 6)
   ───────────────────────────────────────────── */
const UI_Biblioteca = {

  registrar() {
    const titulo = leerTexto('lib-tit');
    const autor  = leerTexto('lib-aut');
    const isbn   = leerTexto('lib-isbn');
    if (!titulo || !autor || !isbn) {
      setResultado('lib-res', 'Completa todos los campos.', 'err');
      return;
    }
    const l = biblioteca.registrar(titulo, autor, isbn);
    setResultado('lib-res',
      `"${l.titulo}" registrado.\nAutor: ${l.autor}`, 'ok');
    toast(`"${l.titulo}" registrado`, 'ok');
    limpiarCampos(['lib-tit', 'lib-aut', 'lib-isbn']);
    this._refrescarSelect();
    this._renderTabla();
    this._actualizarStats();
  },

  prestar() {
    const l       = this._getLibro(); if (!l) return;
    const usuario = leerTexto('lib-usr');
    try {
      setResultado('lib-res-op', l.prestar(usuario), 'warn');
      toast(`"${l.titulo}" prestado a ${usuario}`, 'warn');
      this._refrescarSelect();
      this._renderTabla();
      this._actualizarStats();
    } catch (e) {
      setResultado('lib-res-op', e.message, 'err');
      toast(e.message.split('\n')[0], 'err');
    }
  },

  devolver() {
    const l = this._getLibro(); if (!l) return;
    try {
      setResultado('lib-res-op', l.devolver(), 'ok');
      toast(`"${l.titulo}" devuelto`, 'ok');
      this._refrescarSelect();
      this._renderTabla();
      this._actualizarStats();
    } catch (e) {
      setResultado('lib-res-op', e.message, 'err');
      toast(e.message.split('\n')[0], 'err');
    }
  },

  consultar() {
    const l = this._getLibro(); if (!l) return;
    setResultado('lib-res-op', l.consultarInfo(), l.disponible ? 'ok' : 'warn');
  },

  _getLibro() {
    const id = document.getElementById('lib-sel').value;
    if (!id) {
      setResultado('lib-res-op', 'Selecciona un libro.', 'err');
      return null;
    }
    return biblioteca.obtener(id);
  },

  _refrescarSelect() {
    resetSelect('lib-sel', '— Selecciona un libro —');
    biblioteca.listar().forEach(l =>
      addOpcion('lib-sel', l.id, `${l.titulo} ${l.disponible ? '✔' : '✖'}`)
    );
  },

  _actualizarStats() {
    const s = biblioteca.calcularEstadisticas();
    document.getElementById('lib-total').textContent = s.total;
    document.getElementById('lib-disp').textContent  = s.disponibles;
    document.getElementById('lib-pres').textContent  = s.prestados;
  },

  _renderTabla() {
    const tbody  = document.getElementById('lib-tbody');
    const libros = biblioteca.listar();
    tbody.innerHTML = libros.length === 0
      ? '<tr><td colspan="5" style="text-align:center;color:var(--ink-3);padding:1.5rem">Sin libros registrados</td></tr>'
      : libros.map(l => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace;font-size:.74rem">${l.isbn}</td>
            <td>${l.titulo}</td>
            <td style="color:var(--ink-2)">${l.autor}</td>
            <td><span class="badge ${l.disponible ? 'bg' : 'br'}">${l.disponible ? 'DISPONIBLE' : 'PRESTADO'}</span></td>
            <td style="color:var(--ink-3)">${l.usuarioActual || '—'}</td>
          </tr>`).join('');
  }
};