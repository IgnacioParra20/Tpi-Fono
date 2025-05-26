import { useState } from 'react';
import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiometro from '../features/level2/components/audiometro'; // ← Audiómetro
import Audiograma from '../features/level3/components/audioGrama';
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal';

function App() {
  const [fase, setFase] = useState('login');
  const [usuarioInfo, setUsuarioInfo] = useState(null);

  const handleLogin = (info) => {
    setUsuarioInfo(info);
    setFase('cuestionario');
  };

  const volverAlLogin = () => {
    setFase('login');
    setUsuarioInfo(null);
  };

  const handleFinalizarCuestionario = () => {
    setFase('audiometro'); // ← Ahora va al Audiómetro primero
  };

  const handleVolverDeAudiometro = () => {
    setFase('cuestionario');
  };

  const handleSiguienteDesdeAudiometro = () => {
    setFase('simulador'); // ← Luego va al Audiograma
  };

  const handleVolverDelSimulador = () => {
    setFase('audiometro');
  };

  const handleSiguienteNivelDesdeAudiograma = () => {
    setFase('editor'); // Luego va al interactivo
  };

  return (
    <div className="App">
      {fase === 'login' && <Login onLogin={handleLogin} />}

      {fase === 'cuestionario' && (
        <Cuestionario
          usuario={usuarioInfo?.nombre}
          onFinalizar={handleFinalizarCuestionario}
          onVolver={volverAlLogin}
        />
      )}

      {fase === 'audiometro' && (
        <div>
          <Audiometro />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={handleVolverDeAudiometro}>Volver</button>
            <button onClick={handleSiguienteDesdeAudiometro} style={{ marginLeft: '10px' }}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {fase === 'simulador' && (
        <Audiograma
          onVolver={handleVolverDelSimulador}
          onVolverAlInicio={volverAlLogin}
          onSiguienteNivel={handleSiguienteNivelDesdeAudiograma}
        />
      )}

      {fase === 'editor' && (
        <AudiogramaInteractivo
          onSiguienteNivel={() => console.log('Nivel final alcanzado')}
        />
      )}
    </div>
  );
}

export default App;
