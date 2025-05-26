import React, { useState } from 'react';
import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiograma from '../features/level2/components/audioGrama'; 
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal'; 
import Inicio from '../features/inicio/components/inicio';

function App() {
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [fase, setFase] = useState('login'); 

  const handleLogin = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
    setFase('cuestionario');
  };

  const handleInicio = () => {
    setFase('Inicio');
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

  const handleNivel2 = () => {
    setFase('editor'); 

  };

  return (
    <div className="App">
      {fase === 'login' && <Login onLogin={handleLogin} />}

      {fase === 'login' && (
        <Cuestionario
          usuario={usuarioInfo?.nombre}
          onFinalizar={handleFinalizarCuestionario}
          onVolver={volverAlLogin}
        />
      )}

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
        <Audiograma
          onVolver={handleNivel2}
          onVolverAlInicio={volverAlLogin}
        />

      )}
    </div>
  );
}

export default App;

