import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';

const InventarioConsumibles = () => {
  const navigate = useNavigate();
  
  // 1. El estado empieza VACÍO, esperando los datos del servidor
  const [inventario, setInventario] = useState([]);

  // 2. Estados para el formulario y modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null); 
  const [formNombre, setFormNombre] = useState('');
  const [formDetalle, setFormDetalle] = useState('');

  const cerrarSesion = () => navigate('/');

  // ==========================================
  // CONEXIÓN AL BACKEND (BASE DE DATOS REAL)
  // ==========================================

  // Obtener consumibles (GET)
  const obtenerConsumibles = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/consumibles');
      const datos = await respuesta.json();
      setInventario(datos); // Llenamos la tabla con los datos reales
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  // Se ejecuta automáticamente al entrar a la página
  useEffect(() => {
    obtenerConsumibles();
  }, []);

  // Botones para abrir el Modal
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

  // Guardar Consumible (POST / PUT)
  const guardarItem = async () => {
    if (!formNombre || !formDetalle) return alert("Llena todos los campos");

    try {
      if (itemEditando) {
        // ACTUALIZAR (PUT)
        await fetch(`http://localhost:5000/api/consumibles/${itemEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: formNombre, detalle: formDetalle })
        });
      } else {
        // CREAR (POST)
        await fetch('http://localhost:5000/api/consumibles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: formNombre, detalle: formDetalle })
        });
      }
      
      setModalAbierto(false); // Cerramos la ventana
      obtenerConsumibles(); // Recargamos la tabla pidiéndole los datos frescos a la BD

    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Eliminar Consumible (DELETE)
  const eliminarItem = async (id) => {
    if (window.confirm("¿Seguro que deseas descartar este objeto?")) {
      try {
        await fetch(`http://localhost:5000/api/consumibles/${id}`, {
          method: 'DELETE'
        });
        obtenerConsumibles(); // Recargamos la tabla
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // ==========================================
  // INTERFAZ VISUAL (UI)
  // ==========================================
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
            placeholder="Detalle (Ej. Cura veneno)" 
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