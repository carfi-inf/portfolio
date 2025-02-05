// Al caricamento del DOM aggiungiamo il listener al testo cliccabile
document.addEventListener("DOMContentLoaded", function () {
  const fallingText = document.getElementById("falling-text");

  fallingText.addEventListener("click", function () {
    // Nascondiamo il testo statico per non creare duplicati
    fallingText.style.visibility = "hidden";
    // Avviamo l'animazione: le lettere che cadono
    createFallingLetters("clicca qui");
  });
});

// Funzione che crea l'animazione con Matter.js
function createFallingLetters(word) {
  // Importa i moduli necessari da Matter.js
  const { Engine, Render, World, Bodies, Events } = Matter;

  // Creiamo il motore fisico e il mondo
  const engine = Engine.create();
  const world = engine.world;
  engine.gravity.y = 1;

  // Creiamo il renderer: lo inseriamo in document.body
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent"
    }
  });

  // Creiamo il pavimento (ground) per fermare le lettere
  const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight - 10,
    window.innerWidth,
    20,
    {
      isStatic: true,
      render: { fillStyle: "black" }
    }
  );
  World.add(world, ground);

  // Dividiamo la parola in lettere
  const letters = word.split("");
  const letterBodies = [];
  const letterElements = [];

  // Otteniamo la posizione iniziale dal rettangolo della parola cliccabile
  const rect = document.getElementById("falling-text").getBoundingClientRect();
  let startX = rect.left;
  let startY = rect.top;

  letters.forEach((letter, index) => {
    // Creiamo l'elemento HTML per la lettera
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter");
    letterDiv.innerText = letter;
    // Posizioniamo la lettera: si dispongono orizzontalmente, con un offset di 40px per lettera
    letterDiv.style.left = (startX + index * 40) + "px";
    letterDiv.style.top = startY + "px";
    document.body.appendChild(letterDiv);

    // Creiamo il corpo fisico corrispondente
    const body = Bodies.rectangle(
      startX + index * 40,
      startY,
      40,
      40,
      {
        restitution: 0.6, // effetto rimbalzo
        friction: 0.1,
        angle: Math.random() * Math.PI,
        render: { visible: false } // non mostrare il rettangolo
      }
    );
    letterBodies.push(body);
    letterElements.push(letterDiv);
    World.add(world, body);
  });

  // Sincronizziamo la posizione degli elementi HTML con i corpi fisici
  Events.on(engine, "afterUpdate", () => {
    letterBodies.forEach((body, i) => {
      letterElements[i].style.transform = `translate(${body.position.x - 20}px, ${body.position.y - 20}px) rotate(${body.angle}rad)`;
    });
  });

  // Avviamo il motore fisico e il renderer
  Engine.run(engine);
  Render.run(render);

  // Dopo 5 secondi rimuoviamo le lettere e il canvas per liberare risorse
  setTimeout(() => {
    letterBodies.forEach(body => World.remove(world, body));
    letterElements.forEach(el => el.remove());
    Render.stop(render);
    render.canvas.remove();
    render.textures = {};
  }, 5000);
}
