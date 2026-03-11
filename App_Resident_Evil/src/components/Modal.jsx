import React from 'react';

const Modal = ({ isOpen, onClose, titulo, children }) => {
  if (!isOpen) return null;

  return (
  
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      
   
      <div className="bg-gray-900 border border-red-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-down">
        
        <div className="bg-red-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">{titulo}</h2>
          <button 
            onClick={onClose}
            className="text-red-200 hover:text-white font-bold text-xl transition-colors"
            title="Cerrar"
          >
            ✖
          </button>
        </div>

        <div className="p-6 text-gray-300">
          {children}
        </div>
      </div>

    </div>
  );
};

export default Modal;