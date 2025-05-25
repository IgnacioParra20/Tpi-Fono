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
  
  window.onload = () => {
    const nombre = localStorage.getItem('usuario');
    document.getElementById('nombreUsuario').innerText = nombre ?? "Estudiante";
  
    const contenedor = document.getElementById('cuestionario');
    preguntas.forEach((q, i) => {
      const bloque = document.createElement('div');
      bloque.innerHTML = `
        <p><strong>${i + 1}. ${q.pregunta}</strong></p>
        ${q.opciones.map(op => `
          <label>
            <input type="radio" name="pregunta${i}" value="${op}" />
            ${op}
          </label><br/>
        `).join("")}
        <hr/>
      `;
      contenedor.appendChild(bloque);
    });
  };
  
  function enviarRespuestas(){
    let puntaje = 0;
  
    preguntas.forEach((q, i) => {
      const seleccionada = document.querySelector(`input[name="pregunta${i}"]:checked`);
      if (seleccionada && seleccionada.value === q.correcta) {
        puntaje++;
      }
    });
  
    document.getElementById('resultado').innerHTML = `
      <h4>Resultado:</h4>
      <p>Obtuviste ${puntaje} de ${preguntas.length} respuestas correctas.</p>
    `;
  }
  