let usuario = null;
let contenidos = [];

// Función de inicio de sesión
async function login() {
  const nameInput = document.getElementById('username');
  usuario = nameInput.value.trim();

  if (!usuario) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  // Guardamos el nombre en localStorage y mostramos la sección del cuestionario
  localStorage.setItem("usuario", usuario);
  document.getElementById('login-section').classList.add("hidden");
  document.getElementById('content-section').classList.remove("hidden");
  document.getElementById('welcome').innerText = `¡Bienvenido/a, ${usuario}!`;

  await cargarContenidos();
  mostrarMenuNiveles();
}

// Cargar los contenidos desde la API
async function cargarContenidos() {
  try {
    const response = await fetch('/api/contenidos');
    contenidos = await response.json();
  } catch (error) {
    console.error("Error al cargar contenidos:", error);
  }
}

// Mostrar botones de niveles disponibles
function mostrarMenuNiveles() {
  const menu = document.getElementById('niveles');
  menu.innerHTML = ''; // Limpiar contenido anterior

  const nivelesUnicos = [...new Set(contenidos.map(c => c.nivel))];
  nivelesUnicos.forEach(nivel => {
    const btn = document.createElement('button');
    btn.textContent = `Nivel ${nivel}`;
    btn.className = 'btn-nivel';
    btn.onclick = () => loadLevel(nivel);
    menu.appendChild(btn);
  });
}

// Cargar contenido del nivel seleccionado
function loadLevel(nivel) {
  const item = contenidos.find(c => c.nivel === nivel);
  const contentContainer = document.getElementById('content');

  if (!item) {
    contentContainer.innerHTML = "<p>Contenido no disponible.</p>";
    return;
  }

  const html = `
    <h3>${item.tema}</h3>
    <p>${item.teoria}</p>
    <hr>
    <p><strong>${item.pregunta}</strong></p>
    <div class="opciones">
      ${item.opciones.map(op => `
        <button class="btn-opcion" onclick="evaluarRespuesta('${op}', '${item.respuesta}')">${op}</button>
      `).join("")}
    </div>
  `;
  contentContainer.innerHTML = html;
}

// Verificar si la respuesta es correcta
function evaluarRespuesta(seleccionada, correcta) {
  const mensaje = seleccionada === correcta
    ? "✅ ¡Correcto!"
    : `❌ Incorrecto. La respuesta correcta es: ${correcta}`;
  alert(mensaje);
}
