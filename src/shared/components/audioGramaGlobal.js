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
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './audioGramaGlobal.css';

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

  const data = {
    labels: frecuencias,
    datasets: [
      {
        label: 'Air Conduction',
        data: airData,
        borderColor: 'red',
        backgroundColor: 'red',
        pointStyle: 'circle',
        pointRadius: 6,
        tension: 0.3
      },
      {
        label: 'Bone Conduction',
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
    <div className="audiograma-container-grid">
      <div className="audiograma-grafico">
        <Line data={data} options={opciones} height={300} />
      </div>
      <div className="audiograma-interactivo-panel">
        <h3>Modificar puntos del audiograma</h3>

        <div className="sliders-audiograma">
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

        {/* Botón de siguiente nivel */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn-next" onClick={onSiguienteNivel}>
            Siguiente Nivel →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudiogramaInteractivo;