import React, { useEffect, useState } from 'react';
import './cuestionario.css';
import Pregunta from './pregunta';

const preguntas = [
  {
    pregunta: "¿Qué órgano se encarga de la producción vocal?",
    opciones: ["Laringe", "Lengua", "Labios", "Nariz"],
    correcta: "Laringe"
  },
  {
    pregunta: "¿Cuál de los siguientes NO es un órgano articulador?",
    opciones: ["Lengua", "Dientes", "Tráquea", "Labios"],
    correcta: "Tráquea"
  },
  {
    pregunta: "¿Qué especialidad trata los trastornos del lenguaje?",
    opciones: ["Neurología", "Fonoaudiología", "Psicología", "Otorrinolaringología"],
    correcta: "Fonoaudiología"
  }
];

const Questionnaire = () => {
  const [usuario, setUsuario] = useState('');
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const nombre = localStorage.getItem('usuario') || 'Estudiante';
    setUsuario(nombre);
  }, []);

  const handleOpcionChange = (index, opcion) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = opcion;
    setRespuestas(nuevasRespuestas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctas = 0;
    respuestas.forEach((respuesta, i) => {
      if (respuesta === preguntas[i].correcta) {
        correctas++;
      }
    });
    setResultado(`Respuestas correctas: ${correctas} de ${preguntas.length}`);
  };

  return (
    <div className="questionnaire-container">
      <h2 className="titulo">Cuestionario General de Fonoaudiología</h2>
      <p className="saludo">Hola, <strong>{usuario}</strong>. Responde las siguientes preguntas:</p>
      <form onSubmit={handleSubmit}>
        {preguntas.map((item, index) => (
          <Pregunta
            key={index}
            index={index}
            data={item}
            seleccion={respuestas[index]}
            onSelect={handleOpcionChange}
          />
        ))}
        <button type="submit" className="btn-enviar">Enviar respuestas</button>
      </form>
      {resultado && <div className="resultado">{resultado}</div>}
    </div>
  );
};

export default Questionnaire;