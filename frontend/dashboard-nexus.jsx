import { useState } from 'react';

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const consultarCuenta = async () => {
    if (!cuenta.trim()) return;
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/cuenta/${cuenta}`);
      if (!res.ok) throw new Error('Cuenta no encontrada');
      const data = await res.json();
      setDatos(data);
    } catch (err) {
      setError(err.message);
      setDatos(null);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1> Banco Nexus - Consulta de Cuenta</h1>
      <div>
        <input
          type="text"
          placeholder="Número de cuenta (ej. 10001)"
          value={cuenta}
          onChange={(e) => setCuenta(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={consultarCuenta} style={{ padding: '8px 16px' }}>Consultar</button>
      </div>

      {error && <p style={{ color: 'red' }}> {error}</p>}

      {datos && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
            <h2>Cliente: {datos.cliente}</h2>
            <p><strong>Cuenta:</strong> {datos.cuenta}</p>
            <p><strong>Saldo actual:</strong> ${datos.saldo.toFixed(2)} MXN</p>
          </div>

          <h3>Últimos movimientos</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Monto</th><th>Saldo después</th></tr>
            </thead>
            <tbody>
              {datos.movimientos.map((mov, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                  <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td>{mov.tipo}</td>
                  <td style={{ color: mov.tipo === 'depósito' ? 'green' : 'red' }}>
                    ${mov.monto.toFixed(2)}
                  </td>
                  <td>${mov.saldo_despues?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}