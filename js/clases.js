/* ═══════════════════════════════════════════════════════
   ARCHIVO: js/clases.js
   PROPÓSITO: Clases de dominio (lógica de negocio - POO).
   Contiene las 12 clases del proyecto con encapsulación,
   métodos y getters. NO toca el DOM directamente.
   ═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   PROBLEMA 1 — CUENTAS BANCARIAS
   ───────────────────────────────────────────── */

class CuentaBancaria {
  constructor(id, titular, saldoInicial = 0) {
    this._id          = id;
    this._titular     = titular;
    this._saldo       = saldoInicial;
    this._movimientos = 0;
  }

  get id()          { return this._id; }
  get titular()     { return this._titular; }
  get saldo()       { return this._saldo; }
  get movimientos() { return this._movimientos; }

  depositar(monto) {
    if (isNaN(monto) || monto <= 0)
      throw new Error('El monto del depósito debe ser mayor a cero.');
    this._saldo += monto;
    this._movimientos++;
    return `Depósito de ${$$(monto)} realizado.\nSaldo actual: ${$$(this._saldo)}`;
  }

  retirar(monto) {
    if (isNaN(monto) || monto <= 0)
      throw new Error('El monto del retiro debe ser mayor a cero.');
    if (monto > this._saldo)
      throw new Error(
        `Fondos insuficientes.\nDisponible: ${$$(this._saldo)}\nSolicitado: ${$$(monto)}`
      );
    this._saldo -= monto;
    this._movimientos++;
    return `Retiro de ${$$(monto)} realizado.\nSaldo actual: ${$$(this._saldo)}`;
  }

  consultarSaldo() {
    return `Cuenta #${this._id} — ${this._titular}\nSaldo disponible: ${$$(this._saldo)}\nMovimientos: ${this._movimientos}`;
  }
}

class Banco {
  constructor() {
    this._cuentas = [];
    this._nextId  = 1;
  }

  crearCuenta(titular, saldoInicial) {
    const c = new CuentaBancaria(this._nextId++, titular, saldoInicial);
    this._cuentas.push(c);
    return c;
  }

  obtenerCuenta(id) { return this._cuentas.find(c => c.id == id); }
  listarCuentas()   { return this._cuentas; }
}

// Instancia global
const banco = new Banco();


/* ─────────────────────────────────────────────
   PROBLEMA 2 — INVENTARIO
   ───────────────────────────────────────────── */

class Producto {
  constructor(id, nombre, precio, cantidad) {
    this._id       = id;
    this._nombre   = nombre;
    this._precio   = precio;
    this._cantidad = cantidad;
  }

  get id()       { return this._id; }
  get nombre()   { return this._nombre; }
  get precio()   { return this._precio; }
  get cantidad() { return this._cantidad; }

  calcularValorTotal() { return this._precio * this._cantidad; }

  obtenerInfo() {
    return `Producto: ${this._nombre}\nPrecio unitario: ${$$(this._precio)}\nStock: ${this._cantidad} unidades\nValor en inventario: ${$$(this.calcularValorTotal())}`;
  }
}

class Inventario {
  constructor() {
    this._productos = [];
    this._nextId    = 1;
  }

  registrarProducto(nombre, precio, cantidad) {
    const p = new Producto(this._nextId++, nombre, precio, cantidad);
    this._productos.push(p);
    return p;
  }

  calcularValorTotalInventario() {
    return this._productos.reduce((s, p) => s + p.calcularValorTotal(), 0);
  }

  obtenerProducto(id) { return this._productos.find(p => p.id == id); }
  listarProductos()   { return this._productos; }
}

const inventario = new Inventario();


/* ─────────────────────────────────────────────
   PROBLEMA 3 — ESTUDIANTES
   ───────────────────────────────────────────── */

class Estudiante {
  constructor(id, nombre, codigo, asignatura, nota) {
    this._id         = id;
    this._nombre     = nombre;
    this._codigo     = codigo;
    this._asignatura = asignatura;
    this._nota       = nota;
  }

  get id()         { return this._id; }
  get nombre()     { return this._nombre; }
  get codigo()     { return this._codigo; }
  get asignatura() { return this._asignatura; }
  get nota()       { return this._nota; }

  aprobo() { return this._nota >= 3.0; }

  obtenerInfo() {
    return `Nombre: ${this._nombre}\nCódigo: ${this._codigo}\nAsignatura: ${this._asignatura}\nNota final: ${this._nota.toFixed(1)}\nEstado: ${this.aprobo() ? 'APROBÓ ✔' : 'REPROBÓ ✖'}`;
  }
}

class RegistroEstudiantes {
  constructor() {
    this._lista  = [];
    this._nextId = 1;
  }

  registrar(nombre, codigo, asignatura, nota) {
    const e = new Estudiante(this._nextId++, nombre, codigo, asignatura, nota);
    this._lista.push(e);
    return e;
  }

  calcularEstadisticas() {
    const total     = this._lista.length;
    const aprobados = this._lista.filter(e => e.aprobo()).length;
    const promedio  = total
      ? (this._lista.reduce((s, e) => s + e.nota, 0) / total).toFixed(2) : '—';
    return { total, aprobados, reprobados: total - aprobados, promedio };
  }

  obtenerEstudiante(id) { return this._lista.find(e => e.id == id); }
  listarEstudiantes()   { return this._lista; }
}

const registro = new RegistroEstudiantes();


/* ─────────────────────────────────────────────
   PROBLEMA 4 — CARRITO DE COMPRAS
   ───────────────────────────────────────────── */

class ProductoCarrito {
  constructor(id, nombre, precio) {
    this._id     = id;
    this._nombre = nombre;
    this._precio = precio;
  }
  get id()     { return this._id; }
  get nombre() { return this._nombre; }
  get precio() { return this._precio; }
}

class CarritoDeCompras {
  constructor() {
    this._items  = [];
    this._nextId = 1;
  }

  agregarProducto(nombre, precio) {
    const item = new ProductoCarrito(this._nextId++, nombre, precio);
    this._items.push(item);
    return item;
  }

  eliminarProducto(id) {
    const idx = this._items.findIndex(i => i.id == id);
    if (idx === -1) throw new Error('Producto no encontrado en el carrito.');
    return this._items.splice(idx, 1)[0];
  }

  calcularTotal() {
    return this._items.reduce((s, i) => s + i.precio, 0);
  }

  vaciar() { this._items = []; }
  listarItems() { return this._items; }
}

const carrito = new CarritoDeCompras();


/* ─────────────────────────────────────────────
   PROBLEMA 5 — VEHÍCULOS
   ───────────────────────────────────────────── */

class Vehiculo {
  constructor(id, placa, modelo, velocidadMaxima) {
    this._id              = id;
    this._placa           = placa;
    this._modelo          = modelo;
    this._velocidadMaxima = velocidadMaxima;
    this._velocidadActual = 0;
  }

  get id()              { return this._id; }
  get placa()           { return this._placa; }
  get modelo()          { return this._modelo; }
  get velocidadMaxima() { return this._velocidadMaxima; }
  get velocidadActual() { return this._velocidadActual; }

  acelerar(inc) {
    if (isNaN(inc) || inc <= 0) throw new Error('El incremento debe ser positivo.');
    const antes           = this._velocidadActual;
    this._velocidadActual = Math.min(this._velocidadActual + inc, this._velocidadMaxima);
    const diff            = this._velocidadActual - antes;
    const aviso           = this._velocidadActual === this._velocidadMaxima
      ? '\n⚠ Velocidad máxima alcanzada.' : '';
    return `Acelerando +${diff} km/h → Velocidad: ${this._velocidadActual} km/h${aviso}`;
  }

  frenar(dec) {
    if (isNaN(dec) || dec <= 0) throw new Error('El decremento debe ser positivo.');
    const antes           = this._velocidadActual;
    this._velocidadActual = Math.max(this._velocidadActual - dec, 0);
    const diff            = antes - this._velocidadActual;
    const aviso           = this._velocidadActual === 0 ? '\nVehículo detenido.' : '';
    return `Frenando −${diff} km/h → Velocidad: ${this._velocidadActual} km/h${aviso}`;
  }

  detener() {
    this._velocidadActual = 0;
    return `Vehículo ${this._placa} detenido completamente.`;
  }

  obtenerEstado() {
    if (this._velocidadActual === 0)                    return 'DETENIDO';
    if (this._velocidadActual >= this._velocidadMaxima) return 'VEL. MÁX';
    return 'EN MARCHA';
  }

  porcentajeVelocidad() {
    return this._velocidadMaxima > 0
      ? Math.round((this._velocidadActual / this._velocidadMaxima) * 100) : 0;
  }
}

class FlotaVehiculos {
  constructor() {
    this._veh    = [];
    this._nextId = 1;
  }

  registrar(placa, modelo, vmax) {
    const v = new Vehiculo(this._nextId++, placa, modelo, vmax);
    this._veh.push(v);
    return v;
  }

  obtener(id) { return this._veh.find(v => v.id == id); }
  listar()    { return this._veh; }
}

const flota = new FlotaVehiculos();


/* ─────────────────────────────────────────────
   PROBLEMA 6 — BIBLIOTECA
   ───────────────────────────────────────────── */

class Libro {
  constructor(id, titulo, autor, isbn) {
    this._id            = id;
    this._titulo        = titulo;
    this._autor         = autor;
    this._isbn          = isbn;
    this._disponible    = true;
    this._usuarioActual = null;
  }

  get id()            { return this._id; }
  get titulo()        { return this._titulo; }
  get autor()         { return this._autor; }
  get isbn()          { return this._isbn; }
  get disponible()    { return this._disponible; }
  get usuarioActual() { return this._usuarioActual; }

  prestar(usuario) {
    if (!this._disponible)
      throw new Error(`El libro ya está prestado a: ${this._usuarioActual}`);
    if (!usuario) throw new Error('Ingresa el nombre del usuario.');
    this._disponible    = false;
    this._usuarioActual = usuario;
    return `"${this._titulo}" prestado a ${usuario} exitosamente.`;
  }

  devolver() {
    if (this._disponible)
      throw new Error('Este libro no está prestado actualmente.');
    const usr           = this._usuarioActual;
    this._disponible    = true;
    this._usuarioActual = null;
    return `"${this._titulo}" devuelto por ${usr}.\nAhora está disponible.`;
  }

  consultarInfo() {
    return `Título: ${this._titulo}\nAutor: ${this._autor}\nISBN: ${this._isbn}\nEstado: ${this._disponible ? 'Disponible ✔' : 'Prestado ✖'}${!this._disponible ? '\nPrestado a: ' + this._usuarioActual : ''}`;
  }
}

class Biblioteca {
  constructor() {
    this._catalogo = [];
    this._nextId   = 1;
  }

  registrar(titulo, autor, isbn) {
    const l = new Libro(this._nextId++, titulo, autor, isbn);
    this._catalogo.push(l);
    return l;
  }

  calcularEstadisticas() {
    const total       = this._catalogo.length;
    const disponibles = this._catalogo.filter(l => l.disponible).length;
    return { total, disponibles, prestados: total - disponibles };
  }

  obtener(id) { return this._catalogo.find(l => l.id == id); }
  listar()    { return this._catalogo; }
}

const biblioteca = new Biblioteca();