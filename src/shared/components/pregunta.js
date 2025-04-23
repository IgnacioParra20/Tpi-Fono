import React from 'react';
import './pregunta.css';

function Pregunta({ indice, pregunta, seleccion, onSeleccionar }) {
  return (
    <div className="pregunta">
      <h3>{indice + 1}. {pregunta.texto}</h3>
      <ul>
        {pregunta.opciones.map((opcion, i) => (
          <li key={i}>
            <label>
              <input
                type="radio"
                name={`pregunta-${indice}`}
                value={opcion}
                checked={seleccion === opcion}
                onChange={() => onSeleccionar(indice, opcion)}
              />
              {opcion}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pregunta;
