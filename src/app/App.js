import { useState } from 'react';
import Login from '../features/auth/components/login';
import Inicio from '../features/inicio/components/inicio';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiometro from '../features/level2/components/audiometro';
import Audiograma from '../features/level3/components/audioGrama';
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal';

function App() {
  const [fase, setFase] = useState('login');
  const [usuarioInfo, setUsuarioInfo] = useState(null);

  const login = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
    setFase('inicio');
  };

  const volverAlLogin = () => {
    setFase('login');
    setUsuarioInfo(null);
  };

  const handleNivel1 = () => {
    setFase('cuestionario'); // Nivel 1
  };

  const handleNivel2 = () => {
    setFase('audiometro'); // Nivel 2
  };

  const handleNivel3 = () => {
    setFase('simulador'); // Nivel 3 (Audiograma)
  };

  const handleSiguienteNivelDesdeAudiometro = () => {
    setFase('simulador');
  };

  const handleSiguienteNivelDesdeAudiograma = () => {
    setFase('editor');
  };

  return (
    <div className="App">
      {fase === 'login' && <Login onLogin={login} />}

      {fase === 'inicio' && (
        <Inicio
          usuario={usuarioInfo?.nombre}
          onIniciarCuestionario={handleNivel1}
          onConfigurarUsuario={volverAlLogin}
          onCerrarSesion={volverAlLogin}
        />
      )}

      {fase === 'cuestionario' && (
        <Cuestionario
          usuario={usuarioInfo?.nombre}
          onFinalizar={handleNivel2} // Avanza al nivel 2
          onVolver={volverAlLogin}
        />
      )}

      {fase === 'audiometro' && (
        <Audiometro
          onVolver={handleNivel1} // Regresa a cuestionario (nivel 1)
          onSiguienteNivel={handleSiguienteNivelDesdeAudiometro} // Avanza a nivel 3
        />
      )}

      {fase === 'simulador' && (
        <Audiograma
          onVolver={handleNivel2} // Regresa a audiometro (nivel 2)
          onVolverAlInicio={volverAlLogin}
          onSiguienteNivel={handleSiguienteNivelDesdeAudiograma} // Avanza al editor
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
