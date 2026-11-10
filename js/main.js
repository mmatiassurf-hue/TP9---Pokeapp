import {
  cargarPokemones, guardarPokemones,
  cargarUsuarios, guardarUsuarios,
  obtenerSesion, guardarSesion, cerrarSesion
} from "./storage.js";
import { mostrarBatalla } from "./batalla.js";

const app = document.getElementById("app");
let pokemones = cargarPokemones();
let usuarios = cargarUsuarios();

// ---------- HEADER (muestra/oculta botones según quién está logueado) ----------

function actualizarHeader() {
  const sesion = obtenerSesion();
  const logueado = sesion !== null;
  const esAdmin = logueado && sesion.admin;

  document.getElementById("btn-login").style.display = logueado ? "none" : "inline-block";
  document.getElementById("btn-registro").style.display = logueado ? "none" : "inline-block";
  document.getElementById("btn-logout").style.display = logueado ? "inline-block" : "none";
  document.getElementById("btn-carga").style.display = esAdmin ? "inline-block" : "none";

  document.getElementById("usuario-actual").textContent = logueado
    ? `Hola, ${sesion.nombre}${esAdmin ? " (admin)" : ""}`
    : "";
}

// ---------- INICIO ----------

function mostrarInicio() {
  app.innerHTML = `
    <section class="inicio">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu">
      <h2>Bienvenido a PokeApp</h2>
      <p>Explorá la Pokédex, conocé a cada Pokémon y animate a una batalla.</p>
      <div>
        <button id="btn-ir-pokedex">Ver Pokédex</button>
        <button id="btn-ir-batalla">Ir a la Batalla</button>
      </div>
    </section>
  `;
  document.getElementById("btn-ir-pokedex").addEventListener("click", mostrarPokedex);
  document.getElementById("btn-ir-batalla").addEventListener("click", () => mostrarBatalla(app));
}

// ---------- POKÉDEX ----------

function mostrarPokedex() {
  let html = "<h2>Pokédex</h2><div class='grilla'>";

  for (const pokemon of pokemones) {
    html += `
      <div class="tarjeta">
        <p class="numero">#${pokemon.id}</p>
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
        <h3>${pokemon.nombre}</h3>
        <p>${pokemon.tipo.join(" / ")}</p>
        <p class="rareza">${pokemon.rareza}</p>
        <button class="btn-detalle" data-id="${pokemon.id}">Ver más</button>
      </div>
    `;
  }

  html += "</div>";
  app.innerHTML = html;

  const botones = document.querySelectorAll(".btn-detalle");
  for (const boton of botones) {
    boton.addEventListener("click", () => {
      mostrarDetalle(Number(boton.dataset.id));
    });
  }
}

// ---------- DETALLE ----------

function mostrarDetalle(id) {
  const pokemon = pokemones.find((p) => p.id === id);

  app.innerHTML = `
    <button id="btn-volver">← Volver</button>
    <section class="detalle">
      <h2>#${pokemon.id} ${pokemon.nombre}</h2>
      <div class="detalle-imagenes">
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
        ${pokemon.shiny ? `<img src="${pokemon.imagenShiny}" alt="${pokemon.nombre} shiny">` : ""}
      </div>
      <p>${pokemon.descripcion}</p>
      <ul>
        <li><strong>Tipo:</strong> ${pokemon.tipo.join(" / ")}</li>
        <li><strong>Altura:</strong> ${pokemon.altura} m</li>
        <li><strong>Peso:</strong> ${pokemon.peso} kg</li>
        <li><strong>Generación:</strong> ${pokemon.generacion}</li>
        <li><strong>Habilidad:</strong> ${pokemon.habilidad}</li>
        <li><strong>Rareza:</strong> ${pokemon.rareza}</li>
        <li><strong>HP:</strong> ${pokemon.hp}</li>
        <li><strong>Ataque:</strong> ${pokemon.ataque}</li>
        <li><strong>Defensa:</strong> ${pokemon.defensa}</li>
        <li><strong>Velocidad:</strong> ${pokemon.velocidad}</li>
        <li><strong>Evolución:</strong> ${pokemon.tieneEvolucion ? `${pokemon.evolucion} (nivel ${pokemon.nivelEvolucion})` : "No evoluciona"}</li>
      </ul>
      <button id="btn-sonido">🔊 Escuchar</button>
    </section>
  `;

  document.getElementById("btn-volver").addEventListener("click", mostrarPokedex);
  document.getElementById("btn-sonido").addEventListener("click", () => {
    new Audio(pokemon.sonido).play();
  });
}

// ---------- INICIAR SESIÓN ----------

function mostrarLogin() {
  app.innerHTML = `
    <h2>Iniciar sesión</h2>
    <form id="form-login" class="formulario">
      <label>Usuario <input name="username" required></label>
      <label>Contraseña <input name="password" type="password" required></label>
      <button type="submit">Entrar</button>
      <p id="mensaje"></p>
    </form>
  `;

  const form = document.getElementById("form-login");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const username = form.elements.username.value;
    const password = form.elements.password.value;

    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (usuario) {
      guardarSesion(usuario);
      actualizarHeader();
      mostrarInicio();
    } else {
      document.getElementById("mensaje").textContent = "Usuario o contraseña incorrectos.";
    }
  });
}

// ---------- REGISTRARSE ----------

function mostrarRegistro() {
  app.innerHTML = `
    <h2>Registrarse</h2>
    <form id="form-registro" class="formulario">
      <label>Nombre <input name="nombre" required></label>
      <label>Email <input name="email" type="email" required></label>
      <label>Usuario <input name="username" required></label>
      <label>Contraseña <input name="password" type="password" required></label>
      <button type="submit">Crear cuenta</button>
      <p id="mensaje"></p>
    </form>
  `;

  const form = document.getElementById("form-registro");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const username = form.elements.username.value;

    if (usuarios.some((u) => u.username === username)) {
      document.getElementById("mensaje").textContent = "Ese usuario ya existe.";
      return;
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: form.elements.nombre.value,
      email: form.elements.email.value,
      username: username,
      password: form.elements.password.value,
      avatar: "./assets/avatar/default.png",
      admin: false
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    guardarSesion(nuevoUsuario);
    actualizarHeader();
    mostrarInicio();
  });
}

// ---------- CARGAR POKÉMON (solo admin) ----------

function mostrarCarga() {
  const sesion = obtenerSesion();
  if (!sesion || !sesion.admin) {
    app.innerHTML = "<h2>Acceso denegado</h2><p>Solo los administradores pueden cargar Pokémon.</p>";
    return;
  }

  app.innerHTML = `
    <h2>Cargar Pokémon</h2>
    <form id="form-carga" class="formulario">
      <label>Número (id) <input name="id" type="number" min="1" required></label>
      <label>Nombre <input name="nombre" required></label>
      <label>Tipo (separados por coma) <input name="tipo" placeholder="Fuego, Volador" required></label>
      <label>Descripción <textarea name="descripcion" required></textarea></label>
      <label>Altura (m) <input name="altura" type="number" step="0.1" required></label>
      <label>Peso (kg) <input name="peso" type="number" step="0.1" required></label>
      <label>Generación <input name="generacion" type="number" min="1" required></label>
      <label>HP <input name="hp" type="number" required></label>
      <label>Ataque <input name="ataque" type="number" required></label>
      <label>Velocidad <input name="velocidad" type="number" required></label>
      <label>Defensa <input name="defensa" type="number" required></label>
      <label>Habilidad <input name="habilidad" required></label>
      <label class="check"><input name="tieneEvolucion" type="checkbox"> ¿Tiene evolución?</label>
      <label>Evoluciona a <input name="evolucion"></label>
      <label>Nivel de evolución <input name="nivelEvolucion" type="number"></label>
      <label>Rareza
        <select name="rareza">
          <option>Común</option>
          <option>Poco común</option>
          <option>Raro</option>
          <option>Legendario</option>
        </select>
      </label>
      <label>URL imagen <input name="imagen" required></label>
      <label>URL sonido <input name="sonido"></label>
      <label class="check"><input name="shiny" type="checkbox"> ¿Tiene versión shiny?</label>
      <label>URL imagen shiny <input name="imagenShiny"></label>
      <button type="submit">Guardar Pokémon</button>
      <p id="mensaje"></p>
    </form>
  `;

  const form = document.getElementById("form-carga");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = form.elements;

    const id = Number(campos.id.value);
    if (pokemones.some((p) => p.id === id)) {
      document.getElementById("mensaje").textContent = "Ya existe un Pokémon con ese número.";
      return;
    }

    const tieneEvolucion = campos.tieneEvolucion.checked;

    const nuevoPokemon = {
      id: id,
      nombre: campos.nombre.value,
      tipo: campos.tipo.value.split(",").map((t) => t.trim()),
      descripcion: campos.descripcion.value,
      altura: Number(campos.altura.value),
      peso: Number(campos.peso.value),
      generacion: Number(campos.generacion.value),
      hp: Number(campos.hp.value),
      ataque: Number(campos.ataque.value),
      velocidad: Number(campos.velocidad.value),
      defensa: Number(campos.defensa.value),
      habilidad: campos.habilidad.value,
      tieneEvolucion: tieneEvolucion,
      evolucion: tieneEvolucion ? campos.evolucion.value : "",
      nivelEvolucion: tieneEvolucion ? Number(campos.nivelEvolucion.value) : null,
      rareza: campos.rareza.value,
      imagen: campos.imagen.value,
      sonido: campos.sonido.value,
      shiny: campos.shiny.checked,
      imagenShiny: campos.imagenShiny.value
    };

    pokemones.push(nuevoPokemon);
    guardarPokemones(pokemones);
    mostrarPokedex();
  });
}

// ---------- MENÚ ----------

const botonesMenu = document.querySelectorAll("nav button");
for (const boton of botonesMenu) {
  boton.addEventListener("click", () => {
    const vista = boton.dataset.vista;
    if (vista === "inicio") mostrarInicio();
    else if (vista === "pokedex") mostrarPokedex();
    else if (vista === "batalla") mostrarBatalla(app);
    else if (vista === "carga") mostrarCarga();
    else if (vista === "login") mostrarLogin();
    else if (vista === "registro") mostrarRegistro();
    else if (vista === "logout") {
      cerrarSesion();
      actualizarHeader();
      mostrarInicio();
    }
  });
}

// ---------- ARRANQUE ----------

actualizarHeader();
mostrarInicio();