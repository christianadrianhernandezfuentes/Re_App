import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  
  // Controla si estamos registrando o iniciando sesión
  const [esRegistro, setEsRegistro] = useState(false); 
  
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');


    const url = esRegistro 
      ? 'https://re-app-wi6s.onrender.com/api/registro' 
      : 'https://re-app-wi6s.onrender.com/api/login';

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        if (esRegistro) {
          setMensajeExito('¡Credencial creada! Ahora puedes iniciar sesión.');
          setEsRegistro(false); 
          setUsuario('');
          setPassword('');
        } else {
          navigate('/armas'); 
        }
      } else {
        setError(datos.mensaje || 'Error en la solicitud 🩸');
      }
    } catch (err) {
      console.error("Error al conectar al servidor:", err);
      setError('Error de conexión con la base de datos. Verifica que el backend esté encendido.');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/leon.jpg')" }}
    >
      <img 
        src="/umbrella.gif" 
        alt="Logo Umbrella" 
        className="fixed top-5 left-5 w-24 z-50 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]" 
      />

      <div className="bg-black/80 p-10 rounded-2xl backdrop-blur-md shadow-2xl border border-red-900 w-96 text-center">
        
        <h1 className="text-3xl font-bold text-red-600 tracking-widest uppercase mb-6">
          {esRegistro ? 'Nuevo Ingreso' : 'Terminal Umbrella'}
        </h1>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4">{error}</div>}
        {mensajeExito && <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded mb-4">{mensajeExito}</div>}

        <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:border-red-600 transition"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:outline-none focus:border-red-600 transition"
            required
          />
          
          <button 
            type="submit" 
            className={`${esRegistro ? 'bg-blue-800 hover:bg-blue-700' : 'bg-red-800 hover:bg-red-700'} text-white font-bold py-3 rounded mt-4 uppercase tracking-wider transition`}
          >
            {esRegistro ? 'Registrar Credencial' : 'Iniciar Sesión'}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => {
            setEsRegistro(!esRegistro);
            setError(''); 
            setMensajeExito('');
          }}
          className="mt-6 text-gray-400 hover:text-white underline text-sm transition"
        >
          {esRegistro ? '¿Ya eres empleado? Inicia sesión aquí' : '¿Sin credencial? Solicita acceso aquí'}
        </button>

      </div>
    </div>
  );
};

export default Login;