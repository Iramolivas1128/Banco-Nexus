const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3001;
app.use(express.json());

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// URI 
const uri = 'mongodb://192.168.50.145:27017,192.168.50.145:27018,192.168.50.145:27019/banco_nexus?replicaSet=rs0';
let client;
>>>>>>> Stashed changes
=======
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// URI 
const uri = 'mongodb://192.168.50.145:27017,192.168.50.145:27018,192.168.50.145:27019/banco_nexus?replicaSet=rs0';
let client;
>>>>>>> Stashed changes
let db;

// conexion a MongoDB 
async function connectDB() {
  try {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const client = new MongoClient(uri);

=======
=======
>>>>>>> Stashed changes
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      heartbeatFrequencyMS: 2000
    });
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    await client.connect();
    db = client.db('banco_nexus');
    console.log('Conectado al Replica Set MongoDB');

    // funcion para mostrar nodo primario actual 
    const adminDb = client.db('admin');
    const isMaster = await adminDb.command({ isMaster: 1 });
    console.log(`Nodo primario actual: ${isMaster.primary || 'desconocido'}`);
  } catch (error) {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    console.error('Error conectando a MongoDB:', error);
=======
    console.error('Error conectando a MongoDB:', error.message);
    console.log('Reintentando conexión en 5 segundos...');
    setTimeout(connectDB, 5000);
>>>>>>> Stashed changes
=======
    console.error('Error conectando a MongoDB:', error.message);
    console.log('Reintentando conexión en 5 segundos...');
    setTimeout(connectDB, 5000);
>>>>>>> Stashed changes
  }
}
connectDB();


<<<<<<< Updated upstream
<<<<<<< Updated upstream
// ENDPOINT CONSULTA DE CUENTA

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// 1. Consultar cuenta 
app.get('/api/cuenta/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');
    const clientes = db.collection('clientes');

    // Buscar cuenta
    const cuenta = await cuentas.findOne({ numero });
    if (!cuenta) {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      return res.status(404).json({
        error: 'Cuenta no existe'
      });
    }

    // Buscar cliente asociado
    const cliente = await clientes.findOne({
      curp: cuenta.cliente_curp
    });

    // Obtener movimientos
=======
      return res.status(404).json({ error: 'Cuenta no existe' });
    }

    const cliente = await clientes.findOne({ curp: cuenta.cliente_curp });
>>>>>>> Stashed changes
=======
      return res.status(404).json({ error: 'Cuenta no existe' });
    }

    const cliente = await clientes.findOne({ curp: cuenta.cliente_curp });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      movimientos: movimientos.map((m) => ({
=======
      movimientos: movimientos.map(m => ({
>>>>>>> Stashed changes
=======
      movimientos: movimientos.map(m => ({
>>>>>>> Stashed changes
        fecha: m.fecha,
        tipo: m.tipo,
        monto: m.monto,
        saldo_despues: m.saldo_despues,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        descripcion: m.descripcion
=======
        descripcion: m.descripcion,
        sucursal: m.sucursal
>>>>>>> Stashed changes
=======
        descripcion: m.descripcion,
        sucursal: m.sucursal
>>>>>>> Stashed changes
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream


// ENDPOINT DEPÓSITO


=======
=======
>>>>>>> Stashed changes
// 2. Historial completo
app.get('/api/historial/:cuenta', async (req, res) => {
  try {
    const { cuenta } = req.params;
    const historial = await db
      .collection('transacciones')
      .find({ cuenta_numero: cuenta })
      .sort({ fecha: -1 })
      .toArray();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Depósito
<<<<<<< Updated upstream
>>>>>>> Stashed changes
app.post('/api/deposito', async (req, res) => {
  try {
<<<<<<< Updated upstream

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
=======
    const { cuenta_numero, monto, sucursal } = req.body;
    const montoNumerico = parseFloat(monto);
    if (!cuenta_numero || isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ error: 'Monto o cuenta inválidos' });
>>>>>>> Stashed changes
=======
app.post('/api/deposito', async (req, res) => {
  try {
    const { cuenta_numero, monto, sucursal } = req.body;
    const montoNumerico = parseFloat(monto);
    if (!cuenta_numero || isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ error: 'Monto o cuenta inválidos' });
>>>>>>> Stashed changes
    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
    const cuenta = await cuentas.findOne({ numero: cuenta_numero });
    if (!cuenta) return res.status(404).json({ error: 'La cuenta no existe' });

    const nuevoSaldo = parseFloat((cuenta.saldo + montoNumerico).toFixed(2));
    await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
>>>>>>> Stashed changes
=======
    const cuenta = await cuentas.findOne({ numero: cuenta_numero });
    if (!cuenta) return res.status(404).json({ error: 'La cuenta no existe' });

    const nuevoSaldo = parseFloat((cuenta.saldo + montoNumerico).toFixed(2));
    await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
>>>>>>> Stashed changes
    await transacciones.insertOne({
      cuenta_numero,
      fecha: new Date(),
      tipo: 'depósito',
      monto: montoNumerico,
      saldo_despues: nuevoSaldo,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      descripcion: 'Depósito realizado desde API'
    });

    // Respuesta
    res.json({
      mensaje: 'Depósito exitoso',
      cuenta: cuenta_numero,
      monto: montoNumerico,
      nuevoSaldo
=======
      descripcion: 'Depósito realizado desde API',
      sucursal: sucursal || 'MATRIZ'
>>>>>>> Stashed changes
=======
      descripcion: 'Depósito realizado desde API',
      sucursal: sucursal || 'MATRIZ'
>>>>>>> Stashed changes
    });

    res.json({ mensaje: 'Depósito exitoso', cuenta: cuenta_numero, monto: montoNumerico, nuevoSaldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream

// ENDPOINT RETIRO


=======
// 4. Retiro
>>>>>>> Stashed changes
app.post('/api/retiro', async (req, res) => {
  try {
<<<<<<< Updated upstream

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
=======
    const { cuenta_numero, monto, sucursal } = req.body;
    const montoNumerico = parseFloat(monto);
    if (!cuenta_numero || isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ error: 'Monto o cuenta inválidos' });
>>>>>>> Stashed changes
=======
// 4. Retiro
app.post('/api/retiro', async (req, res) => {
  try {
    const { cuenta_numero, monto, sucursal } = req.body;
    const montoNumerico = parseFloat(monto);
    if (!cuenta_numero || isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ error: 'Monto o cuenta inválidos' });
>>>>>>> Stashed changes
    }

    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
    const cuenta = await cuentas.findOne({ numero: cuenta_numero });
    if (!cuenta) return res.status(404).json({ error: 'La cuenta no existe' });
    if (cuenta.saldo < montoNumerico) return res.status(400).json({ error: 'Saldo insuficiente' });

    const nuevoSaldo = parseFloat((cuenta.saldo - montoNumerico).toFixed(2));
    await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
>>>>>>> Stashed changes
=======
    const cuenta = await cuentas.findOne({ numero: cuenta_numero });
    if (!cuenta) return res.status(404).json({ error: 'La cuenta no existe' });
    if (cuenta.saldo < montoNumerico) return res.status(400).json({ error: 'Saldo insuficiente' });

    const nuevoSaldo = parseFloat((cuenta.saldo - montoNumerico).toFixed(2));
    await cuentas.updateOne({ numero: cuenta_numero }, { $set: { saldo: nuevoSaldo } });
>>>>>>> Stashed changes
    await transacciones.insertOne({
      cuenta_numero,
      fecha: new Date(),
      tipo: 'retiro',
      monto: montoNumerico,
      saldo_despues: nuevoSaldo,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      descripcion: 'Retiro realizado desde API'
    });

    // Respuesta
    res.json({
      mensaje: 'Retiro exitoso',
      cuenta: cuenta_numero,
      monto: montoNumerico,
      nuevoSaldo
=======
      descripcion: 'Retiro realizado desde API',
      sucursal: sucursal || 'MATRIZ'
>>>>>>> Stashed changes
=======
      descripcion: 'Retiro realizado desde API',
      sucursal: sucursal || 'MATRIZ'
>>>>>>> Stashed changes
    });

    res.json({ mensaje: 'Retiro exitoso', cuenta: cuenta_numero, monto: montoNumerico, nuevoSaldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Estado simple del Replica Set
app.get('/api/status', async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({ estado: 'Replica Set activo', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ estado: 'Error de conexión', error: error.message });
  }
});
<<<<<<< Updated upstream

<<<<<<< Updated upstream

// SERVIDOR

=======
=======

>>>>>>> Stashed changes
// 6. Estado detallado del Replica Set 
app.get('/api/replica-status', async (req, res) => {
  try {
    if (!client || !client.topology || !client.topology.isConnected()) {
      return res.status(503).json({ estado: 'Desconectado', error: 'No hay conexión con el Replica Set' });
    }
    const adminDb = client.db('admin');
    const isMaster = await adminDb.command({ isMaster: 1 });
    const replSetStatus = await adminDb.command({ replSetGetStatus: 1 }).catch(() => null);
    res.json({
      estado: 'conectado',
      primario: isMaster.primary || 'no determinado',
      soyPrimario: isMaster.ismaster || false,
      nodos: replSetStatus ? replSetStatus.members.map(m => ({ name: m.name, state: m.stateStr })) : []
    });
  } catch (error) {
    res.status(500).json({ estado: 'error', error: error.message });
  }
});
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});