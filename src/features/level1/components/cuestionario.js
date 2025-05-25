import { useState } from 'react';
import Pregunta from '../../../shared/components/pregunta';
import preguntas from '../data/preguntas';
import './cuestionario.css';

function Cuestionario({ usuario, onFinalizar, onVolver }) {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [enviado, setEnviado] = useState(false);

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

          <button className="btn-audiograma" onClick={onFinalizar}>
            Siguiente Nivel
          </button>
          <button onClick={onVolver}>Volver Atrás</button>
        </div>
      )}

      {!enviado && (
        <button onClick={onVolver}>Volver Atrás</button>
      )}
    </div>
  );
}

export default Cuestionario;