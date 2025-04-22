import React, { useState } from 'react';
import './login.css';

function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      onLogin(nombre.trim());
    }
  };

  return (
    <div className="login">
      <h2>Bienvenido a FonoApp</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">Comenzar cuestionario</button>
      </form>
    </div>
  );
}

export default Login;
