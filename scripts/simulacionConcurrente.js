const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';
const CUENTA_PRUEBA = '10001';

const operaciones = [
  { tipo: 'deposito', monto: 500, sucursal: 'CDMX' },
  { tipo: 'deposito', monto: 300, sucursal: 'GDL' },
  { tipo: 'retiro', monto: 200, sucursal: 'MTY' },
  { tipo: 'deposito', monto: 100, sucursal: 'LPZ' },
  { tipo: 'retiro', monto: 400, sucursal: 'TIJ' },
  { tipo: 'retiro', monto: 50, sucursal: 'CDMX' },
  { tipo: 'deposito', monto: 800, sucursal: 'GDL' },
  { tipo: 'retiro', monto: 300, sucursal: 'MTY' }
];

async function ejecutarOperacion(op) {
  const endpoint = op.tipo === 'deposito' ? '/api/deposito' : '/api/retiro';
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cuenta_numero: CUENTA_PRUEBA,
      monto: op.monto,
      sucursal: op.sucursal
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Error en ${op.tipo} (${op.sucursal}): ${data.error}`);
  return data;
}

async function obtenerSaldo() {
  const res = await fetch(`${API_BASE}/api/cuenta/${CUENTA_PRUEBA}`);
  const data = await res.json();
  return data.saldo;
}

async function main() {
  console.log('=== SIMULACIÓN CONCURRENTE - BANCO NEXUS ===\n');
  const saldoInicial = await obtenerSaldo();
  console.log(`Saldo inicial cuenta ${CUENTA_PRUEBA}: $${saldoInicial}\n`);

  // Calcular saldo esperado secuencial
  let saldoEsperado = saldoInicial;
  for (const op of operaciones) {
    if (op.tipo === 'deposito') saldoEsperado += op.monto;
    else saldoEsperado -= op.monto;
  }
  console.log(`Saldo esperado (sin concurrencia): $${saldoEsperado.toFixed(2)}\n`);

  console.log('Ejecutando operaciones en PARALELO...');
  const inicio = Date.now();
  
  try {
    const resultados = await Promise.all(operaciones.map(op => ejecutarOperacion(op)));
    const fin = Date.now();
    
    console.log(`Completadas ${resultados.length} operaciones en ${fin - inicio} ms\n`);
    
    const saldoFinal = await obtenerSaldo();
    console.log(`Saldo final REAL: $${saldoFinal.toFixed(2)}`);
    console.log(`Diferencia vs esperado: ${(saldoFinal - saldoEsperado).toFixed(2)}`);
    
    if (Math.abs(saldoFinal - saldoEsperado) < 0.01) {
      console.log('\nSIN INCONSISTENCIAS - Las transacciones atómicas funcionaron correctamente');
    } else {
      console.log('\nINCONSISTENCIA DETECTADA - Posible condición de carrera');
    }
  } catch (err) {
    console.error('Error en simulación:', err.message);
  }
}

main();