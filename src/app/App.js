import React, { useState } from 'react';
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal';
import Cuestionario from '../features/level1/components/cuestionario';
import Login from '../features/auth/components/login';

function App() {
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false);

  const handleLogin = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
  };

  const volverAlLogin = () => {
    setUsuarioInfo(null);
    setCuestionarioFinalizado(false);
  };

  return (
    <div className="App">
      {!usuarioInfo ? (
        <Login onLogin={handleLogin} />
      ) : !cuestionarioFinalizado ? (
        <Cuestionario
          usuario={usuarioInfo.nombre}
          onFinalizar={() => setCuestionarioFinalizado(true)}
          onVolver={volverAlLogin}
        />
      ) : (
        <AudiogramaInteractivo onVolver={() => setCuestionarioFinalizado(false)} />
      )}
    </div>
  );
}

export default App;