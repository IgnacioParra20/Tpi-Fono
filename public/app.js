let usuario = null;
let contenidos = [];

    async function login() {
const nameInput = document.getElementById('username');
usuario = nameInput.value.trim();

if (!usuario) {
    alert("Por favor, ingresa tu nombre.");
    return;
}

localStorage.setItem("usuario", usuario);
document.getElementById('login-section').classList.add("hidden");
document.getElementById('content-section').classList.remove("hidden");
document.getElementById('welcome').innerText = `¡Bienvenido/a, ${usuario}!`;

await cargarContenidos();
}

async function cargarContenidos() {
    const response = await fetch('/api/contenidos');
    contenidos = await response.json();
}


function loadLevel(nivel) {
  const item = contenidos.find(c => c.nivel === nivel + 1);
  if (!item) {
    document.getElementById('content').innerHTML = "<p>Contenido no disponible.</p>";
    return;
  }

  const html = `
    <h3>${item.tema}</h3>
    <p>${item.teoria}</p>
    <hr>
    <p><strong>${item.pregunta}</strong></p>
    ${item.opciones.map(op => `
      <button onclick="evaluarRespuesta('${op}', '${item.respuesta}')">${op}</button>
    `).join("")}
  `;
  document.getElementById('content').innerHTML = html;
}

function evaluarRespuesta(opcion, correcta) {
  if (opcion === correcta) {
    alert("✅ ¡Correcto!");
  } else {
    alert("❌ Incorrecto. La respuesta correcta es: " + correcta);
  }
}
