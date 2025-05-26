import React from 'react';
import './inicio.css';

function Inicio({ usuario, onIniciarCuestionario, onConfigurarUsuario, onCerrarSesion }) {
  return (
    <div className="pagina-inicio">
      <h2>Bienvenido, {usuario} 👋</h2>
      <p>Seleccioná una opción para comenzar:</p>

      <div className="opciones">
        <button className="btn-opcion" onClick={onIniciarCuestionario}>
          📝 Iniciar Cuestionario
        </button>

        <button className="btn-opcion" onClick={onConfigurarUsuario}>
          ⚙️ Configurar Usuario
        </button>

        <button className="btn-opcion cerrar" onClick={onCerrarSesion}>
          🔒 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Inicio;
