const preguntas = [
    {
      pregunta: "¿Qué órgano se encarga de la producción vocal?",
      opciones: ["Laringe", "Lengua", "Labios", "Nariz"],
      correcta: "Laringe"
    },
    {
      pregunta: "¿Cuál de los siguientes NO es un órgano articulador?",
      opciones: ["Lengua", "Dientes", "Tráquea", "Labios"],
      correcta: "Tráquea"
    },
    {
      pregunta: "¿Qué especialidad trata los trastornos del lenguaje?",
      opciones: ["Neurología", "Fonoaudiología", "Psicología", "Otorrinolaringología"],
      correcta: "Fonoaudiología"
    }
  ];
  
  window.addEventListener('DOMContentLoaded', () => {
    const nombre = localStorage.getItem('usuario') || "Estudiante";
    document.getElementById('nombreUsuario').textContent = nombre;
  
    const contenedor = document.getElementById('cuestionario');
  
    preguntas.forEach((q, index) => {
      const div = document.createElement('div');
      div.classList.add('pregunta');
  
      const titulo = document.createElement('h4');
      titulo.textContent = `${index + 1}. ${q.pregunta}`;
      div.appendChild(titulo);
  
      q.opciones.forEach(opcion => {
        const label = document.createElement('label');
        label.classList.add('opcion');
  
        const input = document.createElement('input');
        input.type = "radio";
        input.name = `pregunta${index}`;
        input.value = opcion;
  
        label.appendChild(input);
        label.append(` ${opcion}`);
        div.appendChild(label);
      });
  
      contenedor.appendChild(div);
    });
  
    document.getElementById('formCuestionario').addEventListener('submit', function(e) {
      e.preventDefault();
      evaluarCuestionario();
    });
  });
  
  function evaluarCuestionario() {
    let puntaje = 0;
  
    preguntas.forEach((q, i) => {
      const seleccionada = document.querySelector(`input[name="pregunta${i}"]:checked`);
      if (seleccionada && seleccionada.value === q.correcta) {
        puntaje++;
      }
    });
  
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
      <p><strong>Obtuviste ${puntaje} de ${preguntas.length} respuestas correctas.</strong></p>
      ${mensajeFeedback(puntaje)}
    `;
  }
  
  function mensajeFeedback(puntaje) {
    if (puntaje === preguntas.length) {
      return `<p>¡Excelente trabajo! 🎉</p>`;
    } else if (puntaje === 0) {
      return `<p>No te preocupes, ¡podés intentarlo nuevamente! 💪</p>`;
    } else {
      return `<p>¡Vas por buen camino! 🙌</p>`;
    }
  }
  