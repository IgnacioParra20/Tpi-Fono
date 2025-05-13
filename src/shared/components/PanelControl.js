import { useState } from 'react';
import './panelControl.css';

const PanelControl = () => {
  const [selectedEar, setSelectedEar] = useState('both');
  const [volume, setVolume] = useState(40);
  const [frequency, setFrequency] = useState(1000);

  const playTone = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(volume / 120, audioCtx.currentTime); // escala de 0 a 1

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1); // tono de 1 segundo
  };

  return (
    <div className="panel-control">
      <h4>🎛 Panel de Control</h4>

      <div className="control-group">
        <label>Canal Auditivo:</label>
        <div className="botones-oido">
          <button
            className={selectedEar === 'left' ? 'active' : ''}
            onClick={() => setSelectedEar('left')}
          >
            Izquierdo
          </button>
          <button
            className={selectedEar === 'right' ? 'active' : ''}
            onClick={() => setSelectedEar('right')}
          >
            Derecho
          </button>
          <button
            className={selectedEar === 'both' ? 'active' : ''}
            onClick={() => setSelectedEar('both')}
          >
            Ambos
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Volumen (dB): {volume}</label>
        <input
          type="range"
          min="0"
          max="120"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Frecuencia:</label>
        <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))}>
          {[250, 500, 1000, 2000, 4000].map((hz) => (
            <option key={hz} value={hz}>{hz} Hz</option>
          ))}
        </select>
      </div>

      <button className="btn-tone" onClick={playTone}>🔊 Reproducir Tono</button>
    </div>
  );
};

export default PanelControl;
