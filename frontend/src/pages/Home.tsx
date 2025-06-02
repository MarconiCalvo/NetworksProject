import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // o 'token' si usas token
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">
        Bienvenido a Cryto Bank
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Todo listo para que Yenifer trabaje en el frontend
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
