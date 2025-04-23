import React, { useState } from 'react';
import './login.css';

function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim() && edad.trim() && genero.trim()) {
      onLogin({ nombre: nombre.trim(), edad: parseInt(edad.trim(), 10), genero: genero.trim() });
    } else {
      alert('Por favor, ingresa tu nombre, edad y género.');
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
        <input
          type="number"
          placeholder="Ingresa tu edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">Selecciona tu género</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
        <button type="submit">Comenzar cuestionario</button>
      </form>
    </div>
  );
}

export default Login;