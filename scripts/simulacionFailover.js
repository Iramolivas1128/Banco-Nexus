const { MongoClient } = require('mongodb');

const uri = 'mongodb://192.168.50.145:27017,192.168.50.145:27018,192.168.50.145:27019/banco_nexus?replicaSet=rs0';

async function monitorearFailover() {
  let contador = 0;
  while (true) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
    try {
      await client.connect();
      const db = client.db('banco_nexus');
      const adminDb = client.db('admin');
      const isMaster = await adminDb.command({ isMaster: 1 });
      const cuenta = await db.collection('cuentas').findOne({ numero: '10001' });
      console.log(`[${++contador}] Primario: ${isMaster.primary || '?'} | Saldo: $${cuenta.saldo}`);
      await client.close();
    } catch (err) {
      console.log(`[${++contador}] Error: ${err.message.substring(0, 80)}`);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

monitorearFailover();

