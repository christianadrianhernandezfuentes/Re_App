import React from 'react';

const Tabla = ({ items, onEditar, onEliminar }) => 
  {
  return (
    <div className="w-full mt-8 overflow-hidden rounded-lg border border-gray-700 shadow-2xl">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-red-900 text-white uppercase text-sm tracking-widest">
          <tr>
            <th className="p-4">Id</th>
            <th className="p-4">Objeto</th>
            <th className="p-4">Detalle</th>
            <th className="p-4 text-center">Accion</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900">
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
              <td className="p-4 text-gray-500">#{item.id}</td>
              <td className="p-4 font-bold text-white">{item.nombre}</td>
              <td className="p-4">{item.detalle}</td>
              <td className="p-4 flex justify-center gap-3">
                {/* Botón para modificar */}
                <button 
                  onClick={() => onEditar(item)}
                  className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 rounded shadow transition"
                >
                  ¿Modificar?
                </button>
                {/* Botón para eliminar */}
                <button 
                  onClick={() => onEliminar(item.id)}
                  className="bg-red-900 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition"
                >
                  ¿Soltar?
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="4" className="p-6 text-center text-gray-500 italic">
                El maletín está vacío nada bueno
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;