import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';

const InventarioConsumibles = () => {
  const navigate = useNavigate();
  
  const [inventario, setInventario] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null); 
  const [formNombre, setFormNombre] = useState('');
  const [formDetalle, setFormDetalle] = useState('');

  const cerrarSesion = () => navigate('/');

  // Base de datos
  // <<<<>>>>

  // Obtener consumibles get
  const obtenerConsumibles = async () => {
    try {
      const respuesta = await fetch('https://re-app-wi6s.onrender.com/api/consumibles');
      const datos = await respuesta.json();
      setInventario(datos); 
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  useEffect(() => {
    obtenerConsumibles();
  }, []);

  const abrirModalCrear = () => {
    setItemEditando(null);
    setFormNombre('');
    setFormDetalle('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item.id);
    setFormNombre(item.nombre);
    setFormDetalle(item.detalle);
    setModalAbierto(true);
  };

  // Guardar Consumible post
  const guardarItem = async () => {
    if (!formNombre || !formDetalle) return alert("Llena todos los campos");

    try {
      if (itemEditando) {
        // Actualizar put
        await fetch(`https://re-app-wi6s.onrender.com/api/consumibles/${itemEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: formNombre, detalle: formDetalle })
        });
      } else {
        // Crear post
        await fetch('https://re-app-wi6s.onrender.com/api/consumibles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: formNombre, detalle: formDetalle })
        });
      }
      
      setModalAbierto(false);
      obtenerConsumibles(); 

    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Eliminar Consumible delete
  const eliminarItem = async (id) => {
    if (window.confirm("¿Seguro que deseas descartar este objeto?")) {
      try {
        await fetch(`https://re-app-wi6s.onrender.com/api/consumibles/${id}`, {
          method: 'DELETE'
        });
        obtenerConsumibles(); 
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  
  // ul visual bonito
  //<<<>>>>
  return (
  
     <div 
      className="min-h-screen p-10 flex flex-col items-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/leon.jpg')" }}
    >

      <img 
        src="/movimiento.gif" 
        alt="Logo Umbrella" 
        className="fixed top-5 left-5 w-24 z-50 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]" 
      />
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 tracking-widest uppercase">
          Baúl de Consumibles
        </h1>
        <button onClick={cerrarSesion} className="bg-gray-800 border border-gray-600 hover:bg-red-900 text-white px-4 py-2 rounded transition">
          Desconectar
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <Alerta tipo="exito" mensaje="Conexión establecida con el área médica de Umbrella." />

        <div className="my-4 flex justify-end gap-4">
          <button 
            onClick={() => navigate('/armas')}
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition"
          >
            ⬅️ Ver Armas
          </button>

          <button 
            onClick={abrirModalCrear}
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition"
          >
            + Guardar Objeto
          </button>
        </div>

        <Tabla 
          items={inventario} 
          onEditar={abrirModalEditar} 
          onEliminar={eliminarItem} 
        />
      </div>

      <Modal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        titulo={itemEditando ? "Modificar Objeto" : "Registrar Nuevo Objeto"}
      >
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Nombre del objeto" 
            value={formNombre}
            onChange={(e) => setFormNombre(e.target.value)}
            className="bg-gray-800 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-green-500"
          />
          <input 
            type="text" 
            placeholder="Detalle (Ejemplo. Cura veneno)" 
            value={formDetalle}
            onChange={(e) => setFormDetalle(e.target.value)}
            className="bg-gray-800 border border-gray-600 p-2 rounded text-white focus:outline-none focus:border-green-500"
          />
          <button 
            onClick={guardarItem} 
            className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 rounded mt-2"
          >
            Confirmar
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default InventarioConsumibles;