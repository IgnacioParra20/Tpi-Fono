import React, { useState } from 'react';
import logo from '../assets/logo.png';
import './login.css';

function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor, ingresa tu nombre.');
      return;
    }
    if (!edad.trim() || isNaN(edad) || parseInt(edad) <= 0) {
      setError('Por favor, ingresa una edad válida.');
      return;
    }
    if (!genero.trim()) {
      setError('Por favor, selecciona tu género.');
      return;
    }
    setError(''); // Limpiar errores
    onLogin({ nombre: nombre.trim(), edad: parseInt(edad.trim(), 10), genero: genero.trim() });
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-logo-container">
          <img src={logo} alt="Logo de FonoApp" className="login-logo" />
        </div>
        <div className="login-form">
          <h2>Bienvenido a FonoApp</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <label htmlFor="edad">Edad:</label>
            <input
              type="number"
              id="edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />

            <label htmlFor="genero">Género:</label>
            <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecciona tu género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>

            <button type="submit">Comenzar cuestionario</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;