import React, { useState } from 'react';
import preguntas from '../data/preguntas';
import './cuestionario.css';
import Pregunta from '../../../shared/components/pregunta';

function Cuestionario({ usuario, onFinalizar, onVolver }) {
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [enviado, setEnviado] = useState(false);

  const handleRespuesta = (indice, respuesta) => {
    const nuevas = [...respuestas];
    nuevas[indice] = respuesta;
    setRespuestas(nuevas);
  };

  const handleEnviar = () => {
    setEnviado(true);
  };

  return (
    <div className="cuestionario">
      <h2>Hola {usuario}, responde las siguientes preguntas:</h2>
      {preguntas.map((p, i) => (
        <Pregunta
          key={i}
          indice={i}
          pregunta={p}
          seleccion={respuestas[i]}
          onSeleccionar={handleRespuesta}
        />
      ))}

      <button onClick={handleEnviar}>Enviar respuestas</button>

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
            Ver Audiograma
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