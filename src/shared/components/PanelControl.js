import { useState } from 'react';
import './panelControl.css';

const frecuencias = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 8000];

const PanelControl = () => {
  const [canal, setCanal] = useState('ambos');
  const [frecuenciaActiva, setFrecuenciaActiva] = useState(1000);
  const [intensidad, setIntensidad] = useState(40);
  const [modo, setModo] = useState('tono');
  const [formaOnda, setFormaOnda] = useState('pulsado');

  return (
    <div className="panel-control-container">
      <div className="grupo seccion-canal">
        <p><strong>🎧 Canal Auditivo</strong></p>
        <div className="botones-linea">
          <button
            className={`btn-azul ${canal === 'izquierdo' ? 'activo' : ''}`}
            onClick={() => setCanal('izquierdo')}
          >Izquierdo</button>
          <button
            className={`btn-rojo ${canal === 'derecho' ? 'activo' : ''}`}
            onClick={() => setCanal('derecho')}
          >Derecho</button>
          <button
            className={`btn-morado ${canal === 'ambos' ? 'activo' : ''}`}
            onClick={() => setCanal('ambos')}
          >Ambos</button>
        </div>
      </div>

      <div className="grupo seccion-frecuencia">
        <p><strong>√ Frecuencia (Hz)</strong></p>
        <div className="botones-matriz">
          {frecuencias.map(freq => (
            <button
              key={freq}
              className={`btn-frecuencia ${frecuenciaActiva === freq ? 'activo' : ''}`}
              onClick={() => setFrecuenciaActiva(freq)}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo seccion-intensidad">
        <p><strong>🕨 Intensidad (dB)</strong></p>
        <input
          type="range"
          min="0"
          max="120"
          value={intensidad}
          onChange={(e) => setIntensidad(Number(e.target.value))}
        />
        <p className="valor-dB">{intensidad} dB</p>
        <div className="botones-linea">
          {[0, 20, 40, 60, 80].map(val => (
            <button
              key={val}
              className="btn-peq"
              onClick={() => setIntensidad(val)}
            >{val}</button>
          ))}
        </div>
      </div>

      <div className="grupo seccion-modo">
        <p><strong>🧪 Modo de Prueba</strong></p>
        <div className="botones-linea tabs">
          {['tono', 'habla', 'enmascaramiento'].map(op => (
            <button
              key={op}
              className={`btn-tab ${modo === op ? 'activo' : ''}`}
              onClick={() => setModo(op)}
            >
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
        </div>
        <div className="botones-linea">
          <button
            className={`btn-normal ${formaOnda === 'pulsado' ? 'activo' : ''}`}
            onClick={() => setFormaOnda('pulsado')}
          >Pulsado</button>
          <button
            className={`btn-normal ${formaOnda === 'warble' ? 'activo' : ''}`}
            onClick={() => setFormaOnda('warble')}
          >Warble</button>
        </div>
      </div>

      <div className="grupo seccion-calibracion">
        <p><strong>🔧 Calibración</strong></p>
        <button className="btn-calibrar">Calibrar Equipo</button>
      </div>
    </div>
  );
};

export default PanelControl;
