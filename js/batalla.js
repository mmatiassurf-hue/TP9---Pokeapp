// Cada escena es un objeto con: turno, texto y opciones.
// Cada opción dice a qué escena te lleva ("siguiente").
const escenas = {
  inicio: {
    turno: 1,
    texto: "¡Un Pidgey salvaje apareció! Tu Charmander está listo para pelear.",
    opciones: [
      { texto: "ATACAR", siguiente: "ataque1" },
      { texto: "USAR POCIÓN", siguiente: "pocion1" },
      { texto: "HUIR", siguiente: "huida" }
    ]
  },
  ataque1: {
    turno: 2,
    texto: "Charmander usó Ascuas. ¡Le pegó fuerte! Pidgey responde con Tornado y te lastima.",
    opciones: [
      { texto: "ATACAR OTRA VEZ", siguiente: "victoria" },
      { texto: "USAR POCIÓN", siguiente: "pocion2" }
    ]
  },
  pocion1: {
    turno: 2,
    texto: "Usaste una poción. Charmander recuperó energía. Pidgey ataca, pero lo aguantás.",
    opciones: [
      { texto: "ATACAR", siguiente: "ataque2" },
      { texto: "HUIR", siguiente: "huida" }
    ]
  },
  ataque2: {
    turno: 3,
    texto: "Charmander usó Arañazo. ¡Pidgey quedó muy débil!",
    opciones: [
      { texto: "LANZAR POKÉBALL", siguiente: "captura" },
      { texto: "ATACAR", siguiente: "victoria" }
    ]
  },
  pocion2: {
    turno: 3,
    texto: "Te curaste, pero Pidgey usó Ataque Rápido muchas veces seguidas...",
    opciones: [
      { texto: "ATACAR CON TODO", siguiente: "victoria" },
      { texto: "ESPERAR", siguiente: "derrota" }
    ]
  },
  victoria: {
    final: true,
    texto: "🏆 ¡Ganaste! Pidgey se debilitó. Charmander ganó experiencia."
  },
  captura: {
    final: true,
    texto: "🎉 ¡Atrapaste a Pidgey! Ahora es parte de tu equipo."
  },
  derrota: {
    final: true,
    texto: "💀 Charmander se debilitó... Perdiste la batalla."
  },
  huida: {
    final: true,
    texto: "🏃 Escapaste sin problemas. ¡Quizás la próxima!"
  }
};

export function mostrarBatalla(app, nombreEscena = "inicio") {
  const escena = escenas[nombreEscena];

  let html = `
    <h2>Batalla</h2>
    <div class="batalla">
      <div class="combatientes">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" alt="Charmander">
        <span>VS</span>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png" alt="Pidgey">
      </div>
  `;

  if (escena.final) {
    html += `
      <h3>Fin de la batalla</h3>
      <p>${escena.texto}</p>
      <button class="btn-opcion" data-siguiente="inicio">Jugar de nuevo</button>
    `;
  } else {
    html += `
      <h3>Turno ${escena.turno}</h3>
      <p>${escena.texto}</p>
      <p><strong>¿Qué querés hacer?</strong></p>
    `;
    for (const opcion of escena.opciones) {
      html += `<button class="btn-opcion" data-siguiente="${opcion.siguiente}">[ ${opcion.texto} ]</button>`;
    }
  }

  html += "</div>";
  app.innerHTML = html;

  const botones = document.querySelectorAll(".btn-opcion");
  for (const boton of botones) {
    boton.addEventListener("click", () => {
      mostrarBatalla(app, boton.dataset.siguiente);
    });
  }
}