import React from 'react';

const Alerta = ({ mensaje, tipo }) => {
  //Para esto en color rojo significa que da error y cuando es verde funciona.
  const colores = tipo === 'error' 
    ? 'bg-red-900 border-red-500 text-red-100' 
    : 'bg-green-900 border-green-500 text-green-100';

  return (
    <div className={`border-l-4 p-4 mb-4 rounded shadow-lg ${colores}`}>
      <div className="flex items-center">
        <span className="text-2xl mr-3">
          {tipo === 'error' ? '🩸' : '🌿'}
        </span>
        <p className="font-bold tracking-wider">{mensaje}</p>
      </div>
    </div>
  );
};

export default Alerta;