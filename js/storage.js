import { pokemonIniciales } from "./data.js";

// Nombres de las "cajitas" en localStorage
const CLAVE_POKEMONES = "pokeapp_pokemones";
const CLAVE_USUARIOS = "pokeapp_usuarios";
const CLAVE_SESION = "pokeapp_sesion";

// Usuario administrador que viene creado de entrada
const usuariosIniciales = [
  {
    id: 1,
    nombre: "Admin",
    email: "admin@pokeapp.com",
    username: "admin",
    password: "admin123",
    avatar: "./assets/avatar/1.png",
    admin: true
  }
];

// ---------- POKÉMON ----------

export function cargarPokemones() {
  const guardado = localStorage.getItem(CLAVE_POKEMONES);
  if (guardado) {
    return JSON.parse(guardado);
  }
  guardarPokemones(pokemonIniciales);
  return pokemonIniciales;
}

export function guardarPokemones(lista) {
  localStorage.setItem(CLAVE_POKEMONES, JSON.stringify(lista));
}

// ---------- USUARIOS ----------

export function cargarUsuarios() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS);
  if (guardado) {
    return JSON.parse(guardado);
  }
  guardarUsuarios(usuariosIniciales);
  return usuariosIniciales;
}

export function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

// ---------- SESIÓN (quién está logueado) ----------

export function obtenerSesion() {
  const guardado = localStorage.getItem(CLAVE_SESION);
  if (guardado) {
    return JSON.parse(guardado);
  }
  return null; // nadie logueado
}

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}