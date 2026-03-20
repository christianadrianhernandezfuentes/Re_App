const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Baul Armas
// <<<<<<>>>>>>>>>>

// Leer Armas (Filtradas por usuario)
app.get('/api/armas', async (req, res) => {
  try {
    const { usuario_id } = req.query; 
    
    if (!usuario_id) return res.json([]);

    const todasLasArmas = await pool.query(
      'SELECT * FROM armas WHERE usuario_id = $1 ORDER BY id ASC',
      [usuario_id]
    );
    res.json(todasLasArmas.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Crear arma
app.post('/api/armas', async (req, res) => {
  try {
    const { nombre, detalle, usuario_id } = req.body; 
    const nuevaArma = await pool.query(
      'INSERT INTO armas (nombre, detalle, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, detalle, usuario_id]
    );
    res.json(nuevaArma.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar el arma');
  }
});

// Actualizar arma
app.put('/api/armas/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { nombre, detalle } = req.body; 
    
    const armaActualizada = await pool.query(
      'UPDATE armas SET nombre = $1, detalle = $2 WHERE id = $3 RETURNING *',
      [nombre, detalle, id]
    );
    res.json(armaActualizada.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar');
  }
});

// Eliminar arma 
app.delete('/api/armas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM armas WHERE id = $1', [id]);
    res.json({ mensaje: "Arma destruida exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar');
  }
});

// Consumibles  baul
// <<<<>>>>

app.get('/api/consumibles', async (req, res) => {
  try {
    const { usuario_id } = req.query;
    
    if (!usuario_id) return res.json([]);

    const todosLosConsumibles = await pool.query(
      'SELECT * FROM consumibles WHERE usuario_id = $1 ORDER BY id ASC',
      [usuario_id]
    );
    res.json(todosLosConsumibles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener consumibles');
  }
});

// 2. Crear consumible
app.post('/api/consumibles', async (req, res) => {
  try {
    const { nombre, detalle, usuario_id } = req.body;
    const nuevoConsumible = await pool.query(
      'INSERT INTO consumibles (nombre, detalle, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, detalle, usuario_id]
    );
    res.json(nuevoConsumible.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar consumible');
  }
});

// 3. Actualizar consumible
app.put('/api/consumibles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, detalle } = req.body;
    
    const consumibleActualizado = await pool.query(
      'UPDATE consumibles SET nombre = $1, detalle = $2 WHERE id = $3 RETURNING *',
      [nombre, detalle, id]
    );
    res.json(consumibleActualizado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar consumible');
  }
});

// 4. Eliminar consumible
app.delete('/api/consumibles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM consumibles WHERE id = $1', [id]);
    res.json({ mensaje: "Objeto descartado exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar consumible');
  }
});



// Login
app.post('/api/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    const usuarioEncontrado = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1 AND password = $2',
      [usuario, password]
    );

    if (usuarioEncontrado.rows.length > 0) {
      res.json({ 
        success: true, 
        mensaje: "Acceso concedido a la red de Umbrella",
        usuario_id: usuarioEncontrado.rows[0].id 
      });
    } else {
      res.status(401).json({ success: false, mensaje: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor de autenticación');
  }
});

// Registro
app.post('/api/registro', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    await pool.query(
      'INSERT INTO usuarios (usuario, password) VALUES ($1, $2)',
      [usuario, password]
    );
    
    res.json({ success: true, mensaje: "Registro exitoso. Bienvenido a Umbrella." });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ success: false, mensaje: "Ese nombre de usuario ya está en uso." });
    } else {
      console.error(err.message);
      res.status(500).send('Error en el servidor al registrar');
    }
  }
});


app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor de Umbrella Corp corriendo en el puerto ${PORT}`);
});