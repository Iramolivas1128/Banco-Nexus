const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(express.json());


// CORS


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


// CONEXIÓN MONGODB


const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/banco_nexus?replicaSet=rs0';

let db;

async function connectDB() {

  try {

    const client = new MongoClient(uri);

    await client.connect();

    db = client.db('banco_nexus');

    console.log('Conectado a MongoDB');

  } catch (error) {

    console.error('Error MongoDB:', error);

  }

}

connectDB();


// CONSULTAR CUENTA


app.get('/api/cuenta/:numero', async (req, res) => {

  try {

    const { numero } = req.params;

    const cuentas = db.collection('cuentas');
    const clientes = db.collection('clientes');
    const transacciones = db.collection('transacciones');

    const cuenta = await cuentas.findOne({ numero });

    if (!cuenta) {

      return res.status(404).json({
        error: 'Cuenta no encontrada'
      });

    }

    const cliente = await clientes.findOne({
      curp: cuenta.cliente_curp
    });

    const movimientos = await transacciones
      .find({ cuenta_numero: numero })
      .sort({ fecha: -1 })
      .limit(20)
      .toArray();

    res.json({

      cuenta: cuenta.numero,
      cliente: cliente?.nombre || 'Desconocido',
      saldo: cuenta.saldo,
      tipo: cuenta.tipo,

      movimientos: movimientos.map((m) => ({

        fecha: m.fecha,
        tipo: m.tipo,
        monto: m.monto,
        sucursal: m.sucursal || 'Matriz',
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


// HISTORIAL


app.get('/api/historial/:cuenta', async (req, res) => {

  try {

    const { cuenta } = req.params;

    const movimientos = await db
      .collection('transacciones')
      .find({ cuenta_numero: cuenta })
      .sort({ fecha: -1 })
      .toArray();

    res.json(movimientos);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// DEPÓSITO


app.post('/api/deposito', async (req, res) => {

  try {

    const {
      cuenta_numero,
      monto,
      sucursal
    } = req.body;

    const montoNumerico = parseFloat(monto);

    if (
      !cuenta_numero ||
      isNaN(montoNumerico) ||
      montoNumerico <= 0
    ) {

      return res.status(400).json({
        error: 'Datos inválidos'
      });

    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    const cuenta = await cuentas.findOne({
      numero: cuenta_numero
    });

    if (!cuenta) {

      return res.status(404).json({
        error: 'Cuenta no encontrada'
      });

    }

    const nuevoSaldo = parseFloat(
      (cuenta.saldo + montoNumerico).toFixed(2)
    );

    await cuentas.updateOne(
      { numero: cuenta_numero },
      {
        $set: {
          saldo: nuevoSaldo
        }
      }
    );

    await transacciones.insertOne({

      cuenta_numero,
      fecha: new Date(),
      tipo: 'depósito',
      monto: montoNumerico,
      sucursal: sucursal || 'Matriz',
      saldo_despues: nuevoSaldo,
      descripcion: `Depósito desde sucursal ${sucursal || 'Matriz'}`

    });

    res.json({

      mensaje: 'Depósito exitoso',
      nuevoSaldo

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// RETIRO


app.post('/api/retiro', async (req, res) => {

  try {

    const {
      cuenta_numero,
      monto,
      sucursal
    } = req.body;

    const montoNumerico = parseFloat(monto);

    if (
      !cuenta_numero ||
      isNaN(montoNumerico) ||
      montoNumerico <= 0
    ) {

      return res.status(400).json({
        error: 'Datos inválidos'
      });

    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    const cuenta = await cuentas.findOne({
      numero: cuenta_numero
    });

    if (!cuenta) {

      return res.status(404).json({
        error: 'Cuenta no encontrada'
      });

    }

    if (cuenta.saldo < montoNumerico) {

      return res.status(400).json({
        error: 'Saldo insuficiente'
      });

    }

    const nuevoSaldo = parseFloat(
      (cuenta.saldo - montoNumerico).toFixed(2)
    );

    await cuentas.updateOne(
      { numero: cuenta_numero },
      {
        $set: {
          saldo: nuevoSaldo
        }
      }
    );

    await transacciones.insertOne({

      cuenta_numero,
      fecha: new Date(),
      tipo: 'retiro',
      monto: montoNumerico,
      sucursal: sucursal || 'Matriz',
      saldo_despues: nuevoSaldo,
      descripcion: `Retiro desde sucursal ${sucursal || 'Matriz'}`

    });

    res.json({

      mensaje: 'Retiro exitoso',
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

  console.log(`Servidor ejecutándose en puerto ${PORT}`);

});