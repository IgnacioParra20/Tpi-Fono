import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './audioGramaGlobal.css';
import PanelControl from './PanelControl';


ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const frecuencias = [250, 500, 1000, 2000, 4000];

const AudiogramaInteractivo = ({ onSiguienteNivel }) => {
  const [airData, setAirData] = useState([40, 45, 50, 55, 60]);
  const [boneData, setBoneData] = useState([20, 25, 30, 35, 40]);

  const handleSliderChange = (index, tipo, value) => {
    const update = tipo === 'air' ? [...airData] : [...boneData];
    update[index] = parseInt(value);
    tipo === 'air' ? setAirData(update) : setBoneData(update);
  };

  const handleVolver = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/'; // Ruta segura por si no hay historial
    }
  };

  const data = {
    labels: frecuencias,
    datasets: [
      {
        label: 'Conducción Aérea',
        data: airData,
        borderColor: 'red',
        backgroundColor: 'red',
        pointStyle: 'circle',
        pointRadius: 6,
        tension: 0.3
      },
      {
        label: 'Conducción Ósea',
        data: boneData,
        borderColor: 'blue',
        backgroundColor: 'blue',
        pointStyle: 'crossRot',
        pointRadius: 6,
        tension: 0.3
      }
    ]
  };

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Editor de Audiograma'
      }
    },
    scales: {
      y: {
        reverse: true,
        min: 0,
        max: 120,
        title: {
          display: true,
          text: 'Nivel de audición (dB HL)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Frecuencia (Hz)'
        }
      }
    }
  };

  return (
    <div className="audiograma-wrapper">
      <div className="titulo-central">
        <h3>Modificar puntos del audiograma</h3>
      </div>
      <div className="audiograma-container-grid">
        <div className="audiograma-panel-sliders">
          <div className="bloque-sliders">
            <h4>Conducción Aérea (Aire)</h4>

            {frecuencias.map((freq, i) => (
              <div key={freq} className="slider-group">
                <p><strong>{freq} Hz</strong></p>
                <label>
                  Aire:
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="1"
                    value={airData[i]}
                    onChange={(e) => handleSliderChange(i, 'air', e.target.value)}
                  />
                  {airData[i]} dB
                </label>
              </div>
            ))}
          </div>
        </div>

<div className="audiograma-grafico">
  <Line data={data} options={opciones} height={300} />
</div>

        <div className="audiograma-panel-sliders">
          <div className="bloque-sliders">
            <h4>Conducción Ósea (Hueso)</h4>
            {frecuencias.map((freq, i) => (
              <div key={freq} className="slider-group">
                <p><strong>{freq} Hz</strong></p>

                <label>
                  Hueso:
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="1"
                    value={boneData[i]}
                    onChange={(e) => handleSliderChange(i, 'bone', e.target.value)}
                  />
                  {boneData[i]} dB
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
<PanelControl />
      <div className="botones-navegacion">
        <button className="btn-volver" onClick={handleVolver}>
          ← Volver
        </button>
        <button className="btn-next" onClick={onSiguienteNivel}>
          Siguiente Nivel →
        </button>
      </div>
    </div>
  );
};

export default AudiogramaInteractivo;

