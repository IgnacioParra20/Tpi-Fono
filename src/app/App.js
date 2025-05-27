import { useState } from 'react';
import Login from '../features/auth/components/login';
import Inicio from '../features/inicio/components/inicio';
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

  const handleInicio = () => {
    setFase('inicio');
  const handleLogin = (info) => {
    setUsuarioInfo(info);
    setFase('cuestionario');
  };

  const volverAlLogin = () => {
    setFase('login');
    setUsuarioInfo(null);
  };
  const handleNivel1 = () => {
    setFase('nivel1');
  };
  /*const handleNivel2 = () => {
    setFase('nivel2');
  };*/

  const handleNivel3 = () => {
    setFase('nivel3');
  };

  const handleVolverDeAudiometro = () => {
    setFase('cuestionario');
  };

  const handleSiguienteDesdeAudiometro = () => {
    setFase('simulador');
  };

  const handleVolverDelSimulador = () => {
    setFase('audiometro');
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
          onConfigurarUsuario= {volverAlLogin}
          onCerrarSesion= {volverAlLogin}

        />
      )}

      {fase === 'audiometro' && (
        <Audiometro
          onVolver={handleVolverDeAudiometro}
          onSiguienteNivel={handleSiguienteDesdeAudiometro}
        />
      )}

      {fase === 'nivel3' && (
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
}
export default App;
