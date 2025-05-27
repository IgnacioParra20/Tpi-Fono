import { useState } from 'react';
import './audiometro.css';

const botones = [
  { id: 1, nombre: 'Shift', top: '5%', left: '10%' },
  { id: 2, nombre: 'Setup', top: '5%', left: '85%' },
  { id: 3, nombre: 'Tone', top: '25%', left: '15%' },
  { id: 4, nombre: 'Warble', top: '25%', left: '25%' },
  { id: 5, nombre: 'Wavefile', top: '25%', left: '35%' },
  { id: 6, nombre: 'Mic', top: '25%', left: '45%' },
  { id: 7, nombre: '1 CD', top: '25%', left: '55%' },
  { id: 8, nombre: '2', top: '25%', left: '65%' },
  { id: 9, nombre: 'Right Insert', top: '40%', left: '10%', color: 'red' },
  { id: 10, nombre: 'Left Insert', top: '40%', left: '25%', color: 'red' },
  { id: 11, nombre: 'R Bone', top: '40%', left: '40%', color: 'blue' },
  { id: 12, nombre: 'L', top: '40%', left: '50%', color: 'blue' },
  { id: 13, nombre: '1 FF', top: '40%', left: '60%' },
  { id: 14, nombre: '2', top: '40%', left: '70%' },
  { id: 15, nombre: 'Ext Range', top: '55%', left: '20%', color: 'orange' },
  { id: 16, nombre: 'Man', top: '65%', left: '15%' },
  { id: 17, nombre: 'Rev', top: '65%', left: '25%' },
  { id: 18, nombre: 'Single', top: '65%', left: '35%' },
  { id: 19, nombre: 'Multi', top: '65%', left: '45%' },
  { id: 20, nombre: 'Monitor 1', top: '55%', left: '65%' },
  { id: 21, nombre: 'Monitor 2', top: '55%', left: '75%' },
  { id: 22, nombre: 'Talk Back', top: '55%', left: '85%' },
  { id: 23, nombre: 'Store', top: '75%', left: '25%', color: 'yellow' },
  { id: 24, nombre: 'No Resp', top: '75%', left: '35%', color: 'yellow' },
  { id: 25, nombre: 'Incorrect', top: '85%', left: '25%' },
  { id: 26, nombre: 'Correct', top: '85%', left: '35%' },
  { id: 27, nombre: 'Down', top: '95%', left: '25%' },
  { id: 28, nombre: 'Up', top: '95%', left: '35%' },
  { id: 29, nombre: 'Tone Switch/Enter', top: '90%', left: '10%' }
];

const Audiometro = ({ onSiguienteNivel, onVolver }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [aciertos, setAciertos] = useState([]);

  const botonActual = botones[indiceActual];

  const manejarClickBoton = (id) => {
    if (id === botonActual.id) {
      setAciertos([...aciertos, id]);
      setIndiceActual((prev) => prev + 1);
    } else {
      alert('Botón incorrecto. Intenta de nuevo.');
    }
  };

  const finalizado = indiceActual >= botones.length;

  return (
    <div className="audiometro-container">
      <h2>Identifica las partes del audiómetro</h2>

      {!finalizado ? (
        <>
          <p>Haz clic en el botón correcto: <strong>{botonActual.nombre}</strong></p>
          <div className="botones-prueba">
            {botones.map((btn) => (
              <button
                key={btn.id}
                className={`boton-prueba ${aciertos.includes(btn.id) ? 'acertado' : ''} ${btn.color || ''}`}
                onClick={() => manejarClickBoton(btn.id)}
                style={{ top: btn.top, left: btn.left }}
              />
            ))}
          </div>
          <p>Botón {indiceActual + 1} de {botones.length}</p>
        </>
      ) : (
        <>
          <div className="finalizado-box">
            <h3>¡Excelente! Has identificado todos los botones correctamente.</h3>
          </div>

          <div className="botones-navegacion">
            <button className="volver-btn" onClick={onVolver}>Volver</button>
            <button onClick={onSiguienteNivel}>Siguiente Nivel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Audiometro;
    