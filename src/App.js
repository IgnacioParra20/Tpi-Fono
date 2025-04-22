import { useEffect, useState } from "react";
import "./assets/global.css";
import Cuestionario from "./components/cuestionario";
import Login from "./components/login";

function App() {
  const [usuario, setUsuario] = useState(localStorage.getItem("usuario") || "");
  const [contenidos, setContenidos] = useState([]);

  useEffect(() => {
    fetch("/contenidos.json")
      .then(res => res.json())
      .then(data => setContenidos(data));
  }, []);

  return (
    <div className="app-container">
      {usuario ? (
        <Cuestionario usuario={usuario} contenidos={contenidos} />
      ) : (
        <Login setUsuario={setUsuario} />
      )}
    </div>
  );
}

export default App;
