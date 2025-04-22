import React, { useState } from 'react';
import AudiogramaInteractivo from './components/audioGrama';
import Cuestionario from './components/cuestionario';
import Login from './components/login';

function App() {
  const [usuario, setUsuario] = useState('');
  const [cuestionarioFinalizado, setCuestionarioFinalizado] = useState(false);

  return (
    <div className="App">
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : !cuestionarioFinalizado ? (
        <Cuestionario usuario={usuario} onFinalizar={() => setCuestionarioFinalizado(true)} />
      ) : (
        <AudiogramaInteractivo />
      )}
    </div>
  );
}

export default App;
