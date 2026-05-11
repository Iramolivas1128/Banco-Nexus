const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function crearBaseDeDatos() {
  try {
    await client.connect();
    const db = client.db('banco_nexus');

    // Eliminar colecciones existentes (para reiniciar)
    await db.dropCollection('clientes').catch(() => {});
    await db.dropCollection('cuentas').catch(() => {});
    await db.dropCollection('transacciones').catch(() => {});

    const clientesCol = db.collection('clientes');
    const cuentasCol = db.collection('cuentas');
    const transaccionesCol = db.collection('transacciones');

    // ---------- CLIENTES ----------
const clientesData = [
  { curp: 'OICC900101HDFXXX01', nombre: 'Cristhian Olivas', email: 'cristhian@nexus.com' },
  { curp: 'FIIV850203HDFXXX02', nombre: 'Iván Figeroa', email: 'ivan@nexus.com' },
  { curp: 'BEMM920415MDFXXX03', nombre: 'María Beltran', email: 'maria@nexus.com' },
  { curp: 'HEHC880627HDFXXX04', nombre: 'Carlos Hernández', email: 'carlos@nexus.com' },
  { curp: 'MASO951112MDFXXX05', nombre: 'Sofía Martinez', email: 'sofia@nexus.com' },
  { curp: 'GAJJ020304HDFXXX06', nombre: 'Javier García', email: 'javier@nexus.com' },
  { curp: 'OLPA780819MDFXXX07', nombre: 'Patricia Olivas', email: 'patricia@nexus.com' },
  { curp: 'JIRO830505HDFXXX08', nombre: 'Roberto Jimenez', email: 'roberto@nexus.com' },
  { curp: 'VIPF900909HDFXXX09', nombre: 'Pancho Villa', email: 'pancho@nexus.com' },
  { curp: 'MELN751212HDFXXX10', nombre: 'Leonel Messi', email: 'leonel@nexus.com' },
  { curp: 'ROCC880303HDFXXX11', nombre: 'Cristhian Ronaldo', email: 'cristiano@nexus.com' },
  { curp: 'FODA960606HDFXXX12', nombre: 'Daniel Flores', email: 'daniel@nexus.com' }
];

await clientesCol.insertMany(clientesData);
console.log('Clientes insertados');

// ---------- CUENTAS  ----------
const cuentasData = [
  { numero: '10001', cliente_curp: 'OICC900101HDFXXX01', saldo: 12500.00, tipo: 'ahorro' },
  { numero: '10002', cliente_curp: 'FIIV850203HDFXXX02', saldo: 8500.50, tipo: 'corriente' },
  { numero: '10003', cliente_curp: 'BEMM920415MDFXXX03', saldo: 23000.00, tipo: 'ahorro' },
  { numero: '10004', cliente_curp: 'HEHC880627HDFXXX04', saldo: 3400.75, tipo: 'corriente' },
  { numero: '10005', cliente_curp: 'MASO951112MDFXXX05', saldo: 6700.20, tipo: 'ahorro' },
  { numero: '10006', cliente_curp: 'GAJJ020304HDFXXX06', saldo: 18900.00, tipo: 'corriente' },
  { numero: '10007', cliente_curp: 'OLPA780819MDFXXX07', saldo: 550.30, tipo: 'ahorro' },
  { numero: '10008', cliente_curp: 'JIRO830505HDFXXX08', saldo: 13200.00, tipo: 'corriente' },
  { numero: '10009', cliente_curp: 'VIPF900909HDFXXX09', saldo: 9800.00, tipo: 'ahorro' },
  { numero: '10010', cliente_curp: 'MELN751212HDFXXX10', saldo: 4520.00, tipo: 'corriente' },
  { numero: '10011', cliente_curp: 'ROCC880303HDFXXX11', saldo: 30100.00, tipo: 'ahorro' },
  { numero: '10012', cliente_curp: 'FODA960606HDFXXX12', saldo: 7700.99, tipo: 'corriente' }
];

await cuentasCol.insertMany(cuentasData);
console.log('Cuentas insertadas correctamente');

    // ---------- TRANSACCIONES ----------
    const transaccionesData = [];
    const ahora = new Date();
    for (let i = 1; i <= 12; i++) {
      const cuentaNum = `1000${i}`.slice(-5);
      const saldoInicial = cuentasData[i-1].saldo;
      // Generar movimientos previos
      let saldoAcum = saldoInicial - 1000; 
      for (let j = 1; j <= 4; j++) {
        const monto = (Math.random() * 500 + 100).toFixed(2);
        const tipo = Math.random() > 0.5 ? 'depósito' : 'retiro';
        if (tipo === 'depósito') saldoAcum += parseFloat(monto);
        else saldoAcum -= parseFloat(monto);
        transaccionesData.push({
          cuenta_numero: cuentaNum,
          fecha: new Date(ahora.getTime() - j * 24 * 60 * 60 * 1000),
          tipo,
          monto: parseFloat(monto),
          saldo_despues: parseFloat(saldoAcum.toFixed(2)),
          descripcion: `${tipo === 'depósito' ? 'Abono' : 'Cargo'} automático`
        });
      }
      // transacción final que iguala el saldo actual
      transaccionesData.push({
        cuenta_numero: cuentaNum,
        fecha: ahora,
        tipo: 'apertura',
        monto: saldoInicial,
        saldo_despues: saldoInicial,
        descripcion: 'Saldo inicial'
      });
    }
    await transaccionesCol.insertMany(transaccionesData);
    console.log('Transacciones insertadas');

    console.log('Base de datos banco_nexus inicializada correctamente');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

crearBaseDeDatos();