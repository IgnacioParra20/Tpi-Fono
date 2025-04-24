import React, { useState } from 'react';
import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiograma from '../features/level2/components/audioGrama'; // Ejemplo: siguiente nivel tras el editor
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal';

function App() {
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [fase, setFase] = useState('login'); // login, cuestionario, editor, simulador, etc.

  const handleLogin = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
    setFase('cuestionario');
  };

  const volverAlLogin = () => {
    setUsuarioInfo(null);
    setFase('login');
  };

  const handleFinalizarCuestionario = () => {
    setFase('editor');
  };

  const handleSiguienteNivel = () => {
    setFase('simulador');
  };

  const handleVolverDelSimulador = () => {
    setFase('editor'); // o cuestionario si prefieres volver atrás más
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

      {fase === 'editor' && (
        <AudiogramaInteractivo onSiguienteNivel={handleSiguienteNivel} />
      )}

      {fase === 'simulador' && (
        <Audiograma onVolver={handleVolverDelSimulador} />
      )}
    </div>
  );
}

export default App;
