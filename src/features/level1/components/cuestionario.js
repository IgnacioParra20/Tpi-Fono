import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🧭 Importamos el hook
import Pregunta from '../../../shared/components/pregunta';
import preguntas from '../data/preguntas';
import './cuestionario.css';

function Cuestionario({ usuario }) {
  const [preguntaActual, setPreguntaActual] = useState(0);

  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [enviado, setEnviado] = useState(false);

  const navigate = useNavigate(); // 🧭 Hook para navegar

  const handleRespuesta = (indice, respuesta) => {
    const nuevas = [...respuestas];
    nuevas[indice] = respuesta;
    setRespuestas(nuevas);
  };
  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    }
  };

  const anteriorPregunta = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };
  const handleEnviar = () => {
    setEnviado(true);
  };


  const pregunta = preguntas[preguntaActual];

  return (
    <div className="cuestionario">
      <h2>Hola {usuario}, responde las siguientes preguntas:</h2>

      {pregunta && (
        <Pregunta
          key={preguntaActual}
          indice={preguntaActual}
          pregunta={pregunta}
          seleccion={respuestas[preguntaActual]}
          onSeleccionar={handleRespuesta}
        />
      )}

      <div className="navegacion-preguntas">
        {preguntaActual > 0 && (
          <button onClick={anteriorPregunta}>Anterior Pregunta</button>
        )}
        {preguntaActual < preguntas.length - 1 ? (
          <button onClick={siguientePregunta}>Siguiente Pregunta</button>
        ) : (
          <button onClick={handleEnviar}>Enviar respuestas</button>
        )}
      </div>


      {enviado && (
        <div className="resultado">
          <h3>Resultados:</h3>
          <ul>
            {preguntas.map((p, i) => (
              <li key={i}>
                {p.texto} - {respuestas[i] === p.correcta ? '✅ Correcta' : '❌ Incorrecta'}
              </li>
            ))}
          </ul>

          <div className="botones-resultados">
            <button onClick={volverAlInicio}>Volver Atrás</button>
            <button className="btn-audiograma" onClick={irAlEditor}>
              Siguiente Nivel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cuestionario;
