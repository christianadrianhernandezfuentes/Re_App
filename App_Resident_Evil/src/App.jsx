import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import InventarioArmas from './pages/InventarioArmas';
import InventarioConsumibles from './pages/InventarioConsumibles'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/armas" element={<InventarioArmas />} />
        
      
        <Route path="/consumibles" element={<InventarioConsumibles />} />
      </Routes>
    </Router>
  );
}

export default App;