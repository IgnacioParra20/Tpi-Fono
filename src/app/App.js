import { useState } from 'react';
import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiograma from '../features/level2/components/audioGrama';
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
    setFase('simulador'); // Ahora va al Audiograma primero
  };

  const handleVolverDelSimulador = () => {
    setFase('cuestionario');
  };

  const handleSiguienteNivelDesdeAudiograma = () => {
    setFase('editor'); // Ahora va al interactivo después
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

      {fase === 'simulador' && (
        <Audiograma
          onVolver={handleVolverDelSimulador}
          onVolverAlInicio={volverAlLogin}
          onSiguienteNivel={handleSiguienteNivelDesdeAudiograma} // ← Nuevo
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
