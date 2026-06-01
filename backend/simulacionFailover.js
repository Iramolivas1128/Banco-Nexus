const { MongoClient } = require('mongodb');

const uri ='mongodb://192.168.50.145:27017,192.168.50.145:27018,192.168.50.145:27019/banco_nexus?replicaSet=rs0';

async function pruebaFailover() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('banco_nexus');
    const cuentas = db.collection('cuentas');

    console.log('Iniciando monitoreo del Replica Set...\n');

    for (let i = 1; i <= 20; i++) {
      try {
        const cuenta = await cuentas.findOne({
          numero: '10001'
        });
        console.log(
          `[${i}] Sistema activo - Saldo actual: $${cuenta.saldo}`
        );
      } catch (error) {
        console.log(
          `[${i}] Error temporal detectado: ${error.message}`
        );
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

pruebaFailover();