// src/app/App.js
import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Login from '../features/auth/components/login';
import Cuestionario from '../features/level1/components/cuestionario';
import Audiograma from '../features/level2/components/audioGrama';
import AudiogramaInteractivo from '../shared/components/audioGramaGlobal';

function App() {
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const isLoggedIn = Boolean(usuarioInfo);

  const handleLogin = (infoUsuario) => {
    setUsuarioInfo(infoUsuario);
  };

  return (
    <Router>
      <Routes>
        {/* Página de inicio (Login) */}
        <Route path="/" element={
          isLoggedIn
            ? <Navigate to="/nivel1" replace />
            : <Login onLogin={handleLogin} />
        } />

        {/* Nivel 1: Cuestionario */}
        <Route path="/nivel1" element={
          isLoggedIn
            ? <Cuestionario usuario={usuarioInfo?.nombre} onFinalizar={() => {}} onVolver={() => setUsuarioInfo(null)} />
            : <Navigate to="/" replace />
        } />

        {/* Nivel 2: Diagnóstico por audiograma */}
        <Route path="/nivel2" element={
          isLoggedIn
            ? <Audiograma onVolver={() => {}} onVolverAlInicio={() => setUsuarioInfo(null)} />
            : <Navigate to="/" replace />
        } />

        {/* Herramienta: Audiograma interactivo */}
        <Route path="/editor" element={
          isLoggedIn
            ? <AudiogramaInteractivo onSiguienteNivel={() => {}} />
            : <Navigate to="/" replace />
        } />

        {/* Rutas de prueba por separado */}
        <Route path="/nivel1-test" element={<Cuestionario usuario="TestUser" onFinalizar={() => {}} onVolver={() => {}} />} />
        <Route path="/nivel2-test" element={<Audiograma onVolver={() => {}} onVolverAlInicio={() => {}} />} />

        {/* Ruta no encontrada */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
