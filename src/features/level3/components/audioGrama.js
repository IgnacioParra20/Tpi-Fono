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
import './audioGrama.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);
const tiposAudiograma = {
  normal: {
    air: [10, 10, 15, 10, 10],
    bone: [10, 10, 10, 10, 10],
    label: 'Audición normal'
  },
  hipoConduccion: {
    air: [40, 45, 50, 40, 45],
    bone: [10, 10, 15, 10, 15],
    label: 'Hipoacusia de conducción'
  },
  hipoNeurosensorial: {
    air: [50, 55, 60, 65, 70],
    bone: [50, 55, 60, 65, 70],
    label: 'Hipoacusia neurosensorial'
  },
  hipoMixta: {
    air: [60, 65, 70, 75, 80],
    bone: [30, 35, 40, 45, 50],
    label: 'Hipoacusia mixta'
  }
};


const frecuencias = [250, 500, 1000, 2000, 4000];

const Audiograma = ({ onVolver, onVolverAlInicio }) => {
  const [audiograma, setAudiograma] = useState(null);
  const [userData, setUserData] = useState({
  air: [0, 0, 0, 0, 0],
  bone: [0, 0, 0, 0, 0],
  });
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const claves = Object.keys(tiposAudiograma);
    const aleatorio = claves[Math.floor(Math.random() * claves.length)];
    setAudiograma({ tipo: aleatorio, datos: tiposAudiograma[aleatorio] });
  }, []);

  const handleInputChange = (value, type, idx) => {
  const updated = [...userData[type]];
  updated[idx] = isNaN(value) ? 0 : value;
  setUserData({ ...userData, [type]: updated });
};

  const verificarRespuesta = () => {
    const tolerancia = 5;

    const comparar = (arr1, arr2) =>
      arr1.every((val, i) => Math.abs(val - arr2[i]) <= tolerancia);

    const esCorrecto =
      comparar(userData.air, audiograma.datos.air) &&
      comparar(userData.bone, audiograma.datos.bone);

    setResultado(esCorrecto);
  };

  if (!audiograma) return null;

  const data = {
    labels: frecuencias,
    datasets: [
      {
        label: 'Air Conduction (editado)',
        data: userData.air,
        borderColor: 'red',
        backgroundColor: 'red',
        pointStyle: 'circle',
        pointRadius: 6,
        tension: 0.3
      },
      {
        label: 'Bone Conduction (editado)',
        data: userData.bone,
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
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Editá el Audiograma' }
    },
    scales: {
      y: {
        reverse: true,
        min: 0,
        max: 120,
        title: { display: true, text: 'Nivel de audición (dB HL)' }
      },
      x: {
        title: { display: true, text: 'Frecuencia (Hz)' }
      }
    }
  };

  return (
    <div className="audiograma-container-grid">
      <div className="audiograma-grafico">
        <Line data={data} options={opciones} height={300} />
      </div>

      <div className="audiograma-interactivo-panel">
        <p><strong>Configurá el audiograma para representar:</strong></p>
        <p className="patologia-enunciado">{tiposAudiograma[audiograma.tipo].label}</p>

        <div className="edicion-formulario">
          <p>Valores en dB HL para cada frecuencia:</p>

          <div className="tabla-frecuencias">
            <div className="encabezados">
              <div className="frecuencia-label"></div>
              <div className="columna-label">Aire</div>
              <div className="columna-label">Hueso</div>
            </div>

            {frecuencias.map((freq, idx) => (
              <div key={idx} className="fila-frecuencia">
                <label className="frecuencia-label">{freq} Hz:</label>
                <input
                  type="number"
                  value={userData.air[idx]}
                  onChange={(e) =>
                    handleInputChange(Number(e.target.value), 'air', idx)
                  }
                />
                <input
                  type="number"
                  value={userData.bone[idx]}
                  onChange={(e) => handleInputChange(Number(e.target.value), 'bone', idx)}
                  placeholder="Bone"
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={verificarRespuesta}>Verificar configuración</button>

        {resultado !== null && (
          <p className={resultado ? 'correcto' : 'incorrecto'}>
            {resultado ? '✅ ¡Correcto!' : '❌ Incorrecto. Reintentá modificando los valores.'}
          </p>
        )}

        <div className="audiograma-botones">
          <button onClick={onVolver}>Volver al nivel anterior</button>
          <button onClick={onVolverAlInicio}>Volver al Inicio</button>
        </div>
      </div>
    </div>
  );
};

export default Audiograma;
