import React, { useState } from 'react';
import AudiogramaInteractivo from './components/audioGrama';
import Cuestionario from './components/cuestionario';
import Login from './components/login';

function App() {
  const [usuario, setUsuario] = useState('');
  const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false);

  const volverAlLogin = () => {
    setUsuario('');
    setCuestionarioFinalizado(false);
  };

  return (
    <div className="App">
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : !cuestionarioFinalizado ? (
        <Cuestionario
          usuario={usuario}
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