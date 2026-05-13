const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(express.json());

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

// Conexión MongoDB
const uri = 'mongodb://localhost:27017';
let db;

async function connectDB() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    db = client.db('banco_nexus');

    console.log('Conectado a MongoDB');

  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
}

connectDB();


// ENDPOINT CONSULTA DE CUENTA


app.get('/api/cuenta/:numero', async (req, res) => {
  try {

    const { numero } = req.params;

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');
    const clientes = db.collection('clientes');

    // Buscar cuenta
    const cuenta = await cuentas.findOne({ numero });

    if (!cuenta) {
      return res.status(404).json({
        error: 'Cuenta no existe'
      });
    }

    // Buscar cliente asociado
    const cliente = await clientes.findOne({
      curp: cuenta.cliente_curp
    });

    // Obtener movimientos
    const movimientos = await transacciones
      .find({ cuenta_numero: numero })
      .sort({ fecha: -1 })
      .limit(20)
      .toArray();

    // Respuesta final
    res.json({
      cuenta: cuenta.numero,
      cliente: cliente?.nombre || 'Desconocido',
      saldo: cuenta.saldo,
      tipo: cuenta.tipo,
      movimientos: movimientos.map((m) => ({
        fecha: m.fecha,
        tipo: m.tipo,
        monto: m.monto,
        saldo_despues: m.saldo_despues,
        descripcion: m.descripcion
      }))
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



// ENDPOINT DEPÓSITO


app.post('/api/deposito', async (req, res) => {

  try {

    const { cuenta_numero, monto } = req.body;

    // Validar monto
    const montoNumerico = parseFloat(monto);

    if (
      !cuenta_numero ||
      isNaN(montoNumerico) ||
      montoNumerico <= 0
    ) {
      return res.status(400).json({
        error: 'Monto o cuenta inválidos'
      });
    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    // Buscar cuenta
    const cuenta = await cuentas.findOne({
      numero: cuenta_numero
    });

    if (!cuenta) {
      return res.status(404).json({
        error: 'La cuenta no existe'
      });
    }

    // Calcular saldo
    const nuevoSaldo = parseFloat(
      (cuenta.saldo + montoNumerico).toFixed(2)
    );

    // Actualizar cuenta
    await cuentas.updateOne(
      { numero: cuenta_numero },
      {
        $set: {
          saldo: nuevoSaldo
        }
      }
    );

    // Registrar transacción
    await transacciones.insertOne({
      cuenta_numero,
      fecha: new Date(),
      tipo: 'depósito',
      monto: montoNumerico,
      saldo_despues: nuevoSaldo,
      descripcion: 'Depósito realizado desde API'
    });

    // Respuesta
    res.json({
      mensaje: 'Depósito exitoso',
      cuenta: cuenta_numero,
      monto: montoNumerico,
      nuevoSaldo
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});


// ENDPOINT RETIRO


app.post('/api/retiro', async (req, res) => {

  try {

    const { cuenta_numero, monto } = req.body;

    // Validar monto
    const montoNumerico = parseFloat(monto);

    if (
      !cuenta_numero ||
      isNaN(montoNumerico) ||
      montoNumerico <= 0
    ) {
      return res.status(400).json({
        error: 'Monto o cuenta inválidos'
      });
    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    // Buscar cuenta
    const cuenta = await cuentas.findOne({
      numero: cuenta_numero
    });

    if (!cuenta) {
      return res.status(404).json({
        error: 'La cuenta no existe'
      });
    }

    // Validar saldo
    if (cuenta.saldo < montoNumerico) {
      return res.status(400).json({
        error: 'Saldo insuficiente'
      });
    }

    // Calcular saldo
    const nuevoSaldo = parseFloat(
      (cuenta.saldo - montoNumerico).toFixed(2)
    );

    // Actualizar saldo
    await cuentas.updateOne(
      { numero: cuenta_numero },
      {
        $set: {
          saldo: nuevoSaldo
        }
      }
    );

    // Registrar movimiento
    await transacciones.insertOne({
      cuenta_numero,
      fecha: new Date(),
      tipo: 'retiro',
      monto: montoNumerico,
      saldo_despues: nuevoSaldo,
      descripcion: 'Retiro realizado desde API'
    });

    // Respuesta
    res.json({
      mensaje: 'Retiro exitoso',
      cuenta: cuenta_numero,
      monto: montoNumerico,
      nuevoSaldo
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});



// SERVIDOR


app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});