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
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './audioGrama.css';
  
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
  
  const Audiograma = ({ onVolver }) => {
    const [audiograma, setAudiograma] = useState(null);
    const [respuesta, setRespuesta] = useState('');
    const [resultado, setResultado] = useState(null);
  
    useEffect(() => {
      const claves = Object.keys(tiposAudiograma);
      const aleatorio = claves[Math.floor(Math.random() * claves.length)];
      setAudiograma({ tipo: aleatorio, datos: tiposAudiograma[aleatorio] });
    }, []);
  
    const handleRespuesta = (tipoSeleccionado) => {
      setRespuesta(tipoSeleccionado);
      const correcto = tipoSeleccionado === audiograma.tipo;
      setResultado(correcto);
    };
  
    if (!audiograma) return null;
  
    const data = {
      labels: frecuencias,
      datasets: [
        {
          label: 'Air Conduction',
          data: audiograma.datos.air,
          borderColor: 'red',
          backgroundColor: 'red',
          pointStyle: 'circle',
          pointRadius: 6,
          tension: 0.3
        },
        {
          label: 'Bone Conduction',
          data: audiograma.datos.bone,
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
          text: 'Audiograma Simulado'
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
          <div className="pregunta-audiograma">
            <p>¿Qué tipo de pérdida auditiva presenta este paciente?</p>
            <div className="opciones-audiograma">
              {Object.entries(tiposAudiograma).map(([clave, val]) => (
                <button
                  key={clave}
                  className="opcion-btn"
                  onClick={() => handleRespuesta(clave)}
                  disabled={!!resultado}
                >
                  {val.label}
                </button>
              ))}
            </div>
            {resultado !== null && (
              <p className={resultado ? 'correcto' : 'incorrecto'}>
                {resultado ? '✅ ¡Correcto!' : `❌ Incorrecto. Era: ${tiposAudiograma[audiograma.tipo].label}`}
              </p>
            )}
          </div>
          <div className="audiograma-botones"> 
            <button onClick={onVolver}>Volver al Cuestionario</button>
            <button>Siguiente</button> 
          </div>
        </div>
      </div>
    );
  };
  
  export default Audiograma;