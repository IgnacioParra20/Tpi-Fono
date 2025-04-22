import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usuario.trim()) {
      alert('Por favor, ingresa tu nombre.');
      return;
    }
    localStorage.setItem('usuario', usuario);
    navigate('/cuestionario');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Bienvenido a FonoApp</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ej: Ana Pérez"
          />
        </div>
        <button type="submit" className="login-btn">Ingresar</button>
      </form>
      <div className="footer-text">
        Aplicación educativa para estudiantes de Fonoaudiología
      </div>
    </div>
  );
};

export default Login;
