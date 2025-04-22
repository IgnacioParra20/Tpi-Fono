import React, { useState } from 'react';
import AudiogramaInteractivo from './components/audioGrama';
import Cuestionario from './components/cuestionario';
import Login from './components/login';

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