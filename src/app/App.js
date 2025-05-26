import React, { useState } from 'react';
import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiograma from '../features/level2/components/audioGrama'; 
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal'; 
import Inicio from '../features/inicio/components/inicio';

function App() {
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [fase, setFase] = useState('login'); 

  const login = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
    setFase('inicio');
  };

  const handleInicio = () => {
    setFase('inicio');
  };

  const volverAlLogin = () => {
    setUsuarioInfo(null);
    setFase('login');
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

  const handleSiguienteNivel = () => {
    setFase('simulador');
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

      {fase === 'nivel1' && (
        <Cuestionario
          usuario={usuarioInfo?.nombre}
          onFinalizar={handleNivel3}
          onVolver={handleInicio}
        />
      )}

      {fase === 'audiograma' && (
        <AudiogramaInteractivo onSiguienteNivel={handleSiguienteNivel} />
      )}

      {fase === 'nivel3' && (
        <Audiograma
          onVolver={handleNivel1}
          onVolverAlInicio={handleInicio}
        />

      )}
    </div>
  );
}

export default App;

