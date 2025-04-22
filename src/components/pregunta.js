import React from 'react';
import './pregunta.css';

const Pregunta = ({ index, data, seleccion, onSelect }) => {
  return (
    <div className="pregunta">
      <h4>{index + 1}. {data.pregunta}</h4>
      {data.opciones.map((opcion, i) => (
        <label key={i} className="opcion">
          <input
            type="radio"
            name={`pregunta-${index}`}
            value={opcion}
            checked={seleccion === opcion}
            onChange={() => onSelect(index, opcion)}
          />
          {opcion}
        </label>
      ))}
    </div>
  );
};

export default Pregunta;