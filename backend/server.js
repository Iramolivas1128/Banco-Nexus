const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const uri = 'mongodb://localhost:27017';
let db;

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db('banco_nexus');
  console.log('Conectado a MongoDB');
}
connectDB();

// Endpoint(consulta saldo y transacciónes)
app.get('/api/cuenta/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');
    const clientes = db.collection('clientes');

    const cuenta = await cuentas.findOne({ numero });
    if (!cuenta) {
      return res.status(404).json({ error: 'Cuenta no existe' });
    }

    const cliente = await clientes.findOne({ curp: cuenta.cliente_curp });
    const movimientos = await transacciones
      .find({ cuenta_numero: numero })
      .sort({ fecha: -1 })
      .limit(20)
      .toArray();

    res.json({
      cuenta: cuenta.numero,
      cliente: cliente?.nombre || 'Desconocido',
      saldo: cuenta.saldo,
      movimientos: movimientos.map(m => ({
        fecha: m.fecha,
        tipo: m.tipo,
        monto: m.monto,
        saldo_despues: m.saldo_despues,
        descripcion: m.descripcion
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint adicional: depósito (para Etapa 2)
app.post('/api/deposito', async (req, res) => {
  const { cuenta_numero, monto } = req.body;
  if (!cuenta_numero || monto <= 0) return res.status(400).json({ error: 'Datos inválidos' });
  const cuentas = db.collection('cuentas');
  const transacciones = db.collection('transacciones');
  const cuenta = await cuentas.findOne({ numero: cuenta_numero });
  if (!cuenta) return res.status(404).json({ error: 'Cuenta no existe' });

  const nuevoSaldo = cuenta.saldo + monto;
  await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
  await transacciones.insertOne({
    cuenta_numero,
    fecha: new Date(),
    tipo: 'depósito',
    monto,
    saldo_despues: nuevoSaldo,
    descripcion: 'Depósito vía API'
  });
  res.json({ mensaje: 'Depósito exitoso', nuevoSaldo });
});

// Endpoint adicional: retiro
app.post('/api/retiro', async (req, res) => {
  const { cuenta_numero, monto } = req.body;
  if (!cuenta_numero || monto <= 0) return res.status(400).json({ error: 'Monto inválido' });
  const cuentas = db.collection('cuentas');
  const cuenta = await cuentas.findOne({ numero: cuenta_numero });
  if (!cuenta || cuenta.saldo < monto) return res.status(400).json({ error: 'Saldo insuficiente' });

  const nuevoSaldo = cuenta.saldo - monto;
  await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
  await db.collection('transacciones').insertOne({
    cuenta_numero,
    fecha: new Date(),
    tipo: 'retiro',
    monto,
    saldo_despues: nuevoSaldo,
    descripcion: 'Retiro vía API'
  });
  res.json({ mensaje: 'Retiro exitoso', nuevoSaldo });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});