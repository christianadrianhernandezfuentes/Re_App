const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a tu Base de Datos PostgreSQL
const pool = new Pool({
  user: 'postgres',  
  host: 'localhost',
  database: 'umbrella_corp',
  password: 'chris123',
  port: 5432,
});

//Baul de Armas

app.get('/api/armas', async (req, res) => {
  try {
    const todasLasArmas = await pool.query('SELECT * FROM armas ORDER BY id ASC');
    res.json(todasLasArmas.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// 2. Crear arma post
app.post('/api/armas', async (req, res) => {
  try {
    const { nombre, detalle } = req.body;
    const nuevaArma = await pool.query(
      'INSERT INTO armas (nombre, detalle) VALUES ($1, $2) RETURNING *',
      [nombre, detalle]
    );
    res.json(nuevaArma.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar el arma');
  }
});

app.put('/api/armas/:id', async (req, res) => {
  try {
    const { id } = req.params; // Sacamos el ID de la URL
    const { nombre, detalle } = req.body; // Sacamos los nuevos datos del body
    
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

// 4. Eliminar un arma Delete
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

//Baul de Consumibles 

// 1. Leer Get
app.get('/api/consumibles', async (req, res) => {
  try {
    const todosLosConsumibles = await pool.query('SELECT * FROM consumibles ORDER BY id ASC');
    res.json(todosLosConsumibles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener consumibles');
  }
});

// 2. Crear post
app.post('/api/consumibles', async (req, res) => {
  try {
    const { nombre, detalle } = req.body;
    const nuevoConsumible = await pool.query(
      'INSERT INTO consumibles (nombre, detalle) VALUES ($1, $2) RETURNING *',
      [nombre, detalle]
    );
    res.json(nuevoConsumible.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar consumible');
  }
});

// 3. Actualizar put
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

// 4. Eliminar delete
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

app.listen(5000, () => {
  console.log('Servidor de Umbrella Corporation activo en el puerto 5000 🧟‍♂️');
});

// Login y guarda los datos a la bd
app.post('/api/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    const usuarioEncontrado = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1 AND password = $2',
      [usuario, password]
    );

    if (usuarioEncontrado.rows.length > 0) {
      res.json({ success: true, mensaje: "Acceso concedido a la red de Umbrella" });
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