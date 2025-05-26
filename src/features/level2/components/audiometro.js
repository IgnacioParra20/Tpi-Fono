import { useState } from 'react';
import audimetroImg from '../../../assets/audiometro.png';
import './audiometro.css';

const botones = [
  { id: 1, nombre: 'Talk Forward', top: '45%', left: '12%' },
  { id: 2, nombre: 'Left', top: '50%', left: '25%' },
  { id: 3, nombre: 'Start', top: '85%', left: '30%' },
  { id: 4, nombre: 'Talk Back', top: '60%', left: '80%' },  
];

const Audiometro = () => {
  const [respuesta, setRespuesta] = useState('');
  const [indiceActual, setIndiceActual] = useState(0);
  const [aciertos, setAciertos] = useState([]);

  const botonActual = botones[indiceActual];

  const manejarValidacion = () => {
    if (
      respuesta.trim().toLowerCase() ===
      botonActual.nombre.trim().toLowerCase()
    ) {
      setAciertos([...aciertos, botonActual.id]);
      setIndiceActual((prev) => prev + 1);
      setRespuesta('');
    } else {
      alert('Respuesta incorrecta. Intenta de nuevo.');
    }
  };

  const finalizado = indiceActual >= botones.length;

  return (
    <div className="audiometro-container">
      <h2>Identifica las partes del audiómetro</h2>

      <div className="audiometro-content">
        <div className="audiometro-imagen-wrapper">
          <img src={audimetroImg} alt="Audiómetro" className="audiometro-img" />
          {!finalizado && (
            <div
              className="marcador-actual"
              style={{ top: botonActual.top, left: botonActual.left }}
            />
          )}
        </div>

        <div className="respuesta-box">
          {!finalizado ? (
            <>
              <p>¿Qué botón es este?</p>
              <input
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe el nombre del botón..."
              />
              <button onClick={manejarValidacion}>Validar</button>
              <p>
                Botón {indiceActual + 1} de {botones.length}
              </p>
            </>
          ) : (
            <div className="finalizado-box">
              <h3>¡Excelente! Has identificado todos los botones correctamente.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audiometro;
