import './panelControl.css';

const PanelControl = () => {
  return (
    <div className="panel-control-container">
      <h3 className="panel-titulo">Control Panel</h3>

      <div className="grupo seccion-canal">
        <p><strong>🎧 Canal Auditivo</strong></p>
        <div className="botones-linea">
          <button className="btn-azul">Izquierdo</button>
          <button className="btn-rojo">Derecho</button>
          <button className="btn-morado">Ambos</button>
        </div>
      </div>

      <div className="grupo seccion-frecuencia">
        <p><strong>√ Frecuencia (Hz)</strong></p>
        <div className="botones-matriz">
          {[125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 8000].map(freq => (
            <button key={freq} className={`btn-frecuencia ${freq === 1000 ? 'activo' : ''}`}>{freq}</button>
          ))}
        </div>
      </div>

      <div className="grupo seccion-rango">
        <p><strong>⚙️ Rango de Frecuencias</strong></p>
        <div className="botones-linea">
          <button className="btn-naranja activo">Estándar</button>
          <button className="btn-naranja">Extendido</button>
        </div>
      </div>

      <div className="grupo seccion-intensidad">
        <p><strong>🕨 Intensidad (dB)</strong></p>
        <input type="range" min="0" max="120" defaultValue="40" />
        <p className="valor-dB">40 dB</p>
        <div className="botones-linea">
          {[0, 20, 40, 60, 80].map(val => (
            <button key={val} className="btn-peq">{val}</button>
          ))}
        </div>
      </div>

      <div className="grupo seccion-modo">
        <p><strong>🧪 Modo de Prueba</strong></p>
        <div className="botones-linea tabs">
          <button className="btn-tab activo">Tono</button>
          <button className="btn-tab">Habla</button>
          <button className="btn-tab">Enmascaramiento</button>
        </div>
        <div className="botones-linea">
          <button className="btn-normal">Pulsado</button>
          <button className="btn-normal">Warble</button>
        </div>
      </div>

      <div className="grupo seccion-acciones">
        <p><strong>🛠 Acciones de Prueba</strong></p>
        <button className="btn-reproducir">🎵 Reproducir Tono</button>
        <button className="btn-guardar">💾 Guardar Umbral</button>
      </div>

      <div className="grupo seccion-sesion">
        <p><strong>📂 Sesión</strong></p>
        <div className="botones-matriz">
          <button className="btn-normal">Cargar</button>
          <button className="btn-normal">Guardar</button>
          <button className="btn-normal">Imprimir</button>
          <button className="btn-normal">Exportar</button>
        </div>
      </div>

      <div className="grupo seccion-calibracion">
        <p><strong>🔧 Calibración</strong></p>
        <button className="btn-calibrar">Calibrar Equipo</button>
      </div>

      <div className="grupo seccion-extra">
        <p><strong>🧩 Extras</strong></p>
        <div className="botones-linea">
          <button className="btn-normal">Resetear Prueba</button>
          <button className="btn-normal">Ver Historial</button>
        </div>
        <div className="botones-linea">
          <button className="btn-normal">Ayuda</button>
          <button className="btn-normal">Simulación</button>
        </div>
      </div>
    </div>
  );
};

export default PanelControl;

