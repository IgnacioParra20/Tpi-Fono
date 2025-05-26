import audimetroImg from '../../../assets/audiometro.png'; // Asegúrate de que la imagen esté en la carpeta assets
import './audiometro.css';

const Audiometro = () => {
  return (
    <div className="audiometro-container">
      <h2>Audiómetro</h2>
      <img
        src={audimetroImg}
        alt="Audiómetro clínico"
        className="audiometro-img"
      />
    </div>
  );
};

export default Audiometro;
