import { useState, useEffect } from 'react';

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [montoDeposito, setMontoDeposito] = useState('');
  const [montoRetiro, setMontoRetiro] = useState('');
<<<<<<< Updated upstream
=======
  const [sucursal, setSucursal] = useState('MATRIZ');
  const [estadoReplica, setEstadoReplica] = useState('');

  const sucursales = ['MATRIZ', 'CDMX', 'GUADALAJARA', 'MONTERREY', 'LA_PAZ', 'TIJUANA'];

  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/replica-status');
        if (res.ok) {
          const data = await res.json();
          setEstadoReplica(`Primario: ${data.primario}`);
        } else {
          setEstadoReplica('Error en la conexión con el Replica Set');
        }
      } catch (err) {
        setEstadoReplica('No se puede contactar con el backend');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);
>>>>>>> Stashed changes

  const consultarCuenta = async () => {
    if (!cuenta.trim()) return;

    setError('');
    setMensaje('');
    try {
      const res = await fetch(`http://localhost:3001/api/cuenta/${cuenta}`);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al consultar');
      }
      const data = await res.json();
      setDatos(data);

    } catch (err) {
      setError(`Error de conexión: ${err.message}. Posible fallo del nodo primario.`);
      setDatos(null);
    }
  };

  const realizarDeposito = async () => {
    setError('');
    setMensaje('');
    try {
      const res = await fetch('http://localhost:3001/api/deposito', {
        method: 'POST',
<<<<<<< Updated upstream
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cuenta_numero: cuenta,
          monto: parseFloat(montoDeposito)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en depósito');
      }

      setMensaje('Depósito realizado correctamente');
=======
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuenta_numero: cuenta,
          monto: parseFloat(montoDeposito),
          sucursal
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMensaje(`Depósito exitoso en sucursal ${sucursal}`);
>>>>>>> Stashed changes
      setMontoDeposito('');

      consultarCuenta();

    } catch (err) {
      setError(`No se pudo realizar el depósito: ${err.message}. Verifica que el nodo primario esté activo.`);
    }
  };

  const realizarRetiro = async () => {
    setError('');
    setMensaje('');
    try {
      const res = await fetch('http://localhost:3001/api/retiro', {
        method: 'POST',
<<<<<<< Updated upstream
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cuenta_numero: cuenta,
          monto: parseFloat(montoRetiro)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en retiro');
      }

      setMensaje('Retiro realizado correctamente');
=======
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuenta_numero: cuenta,
          monto: parseFloat(montoRetiro),
          sucursal
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMensaje(`Retiro exitoso en sucursal ${sucursal}`);
>>>>>>> Stashed changes
      setMontoRetiro('');

      consultarCuenta();

    } catch (err) {
      setError(`No se pudo realizar el retiro: ${err.message}. Posible fallo del Replica Set.`);
    }
  };

  return (
<<<<<<< Updated upstream
    <div
      style={{
        maxWidth: '950px',
        margin: '40px auto',
        padding: '30px',
        fontFamily: 'Arial',
        backgroundColor: '#f4f7fb',
        borderRadius: '12px',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#1e3a5f',
          marginBottom: '30px'
        }}
      >
        Banco Nexus
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <input
          type="text"
          placeholder="Número de cuenta"
          value={cuenta}
          onChange={(e) => setCuenta(e.target.value)}
          style={{
            padding: '12px',
            width: '250px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />

        <button
          onClick={consultarCuenta}
          style={{
            padding: '12px 20px',
            backgroundColor: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Consultar
        </button>
      </div>

      {error && (
        <p
          style={{
            color: 'red',
            textAlign: 'center',
            marginBottom: '15px'
          }}
        >
          {error}
        </p>
      )}

      {mensaje && (
        <p
          style={{
            color: 'green',
            textAlign: 'center',
            marginBottom: '15px'
          }}
        >
          {mensaje}
        </p>
      )}

      {datos && (
        <>
          <div
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '25px',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
            }}
          >
            <h2 style={{ color: '#1e3a5f' }}>
              {datos.cliente}
            </h2>

            <p>
              <strong>Cuenta:</strong> {datos.cuenta}
            </p>

            <p
              style={{
                fontSize: '24px',
                color: '#0d47a1',
                fontWeight: 'bold'
              }}
            >
              Saldo: ${datos.saldo.toFixed(2)} MXN
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '30px'
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ color: 'green' }}>
                Depósito
              </h3>

              <input
                type="number"
                placeholder="Monto"
                value={montoDeposito}
                onChange={(e) => setMontoDeposito(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc'
                }}
              />

              <button
                onClick={realizarDeposito}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Depositar
              </button>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ color: 'red' }}>
                Retiro
              </h3>

              <input
                type="number"
                placeholder="Monto"
                value={montoRetiro}
                onChange={(e) => setMontoRetiro(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc'
                }}
              />

              <button
                onClick={realizarRetiro}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Retirar
              </button>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.08)'
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>
              Últimos movimientos
            </h3>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#1e3a5f',
                    color: 'white'
                  }}
                >
                  <th style={{ padding: '12px' }}>Fecha</th>
                  <th style={{ padding: '12px' }}>Tipo</th>
                  <th style={{ padding: '12px' }}>Monto</th>
                  <th style={{ padding: '12px' }}>Saldo después</th>
=======
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '30px', fontFamily: 'Arial', backgroundColor: '#f4f7fb', borderRadius: '12px', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#1e3a5f' }}>Banco Nexus - Replica Set</h1>

      <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '8px', borderRadius: '8px' }}>
        Estado del Replica Set: {estadoReplica || 'Consultando...'}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <input type="text" placeholder="Número de cuenta" value={cuenta} onChange={e => setCuenta(e.target.value)} style={{ padding: '12px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
        <button onClick={consultarCuenta} style={{ padding: '12px 20px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Consultar</button>
      </div>

      {/* Selector de sucursal */}
      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sucursal para operaciones:</label>
        <select value={sucursal} onChange={e => setSucursal(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #aaa' }}>
          {sucursales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p style={{ fontSize: '12px', marginTop: '8px', color: '#555' }}>Los depósitos y retiros se registrarán con esta sucursal</p>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '8px' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green', textAlign: 'center', backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '8px' }}>{mensaje}</p>}

      {datos && (
        <>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px' }}>
            <h2>{datos.cliente}</h2>
            <p><strong>Cuenta:</strong> {datos.cuenta}</p>
            <p><strong>Tipo:</strong> {datos.tipo}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d47a1' }}>Saldo: ${datos.saldo.toFixed(2)} MXN</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: 'green' }}>Depósito</h3>
              <input type="number" placeholder="Monto" value={montoDeposito} onChange={e => setMontoDeposito(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
              <button onClick={realizarDeposito} style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none' }}>Depositar</button>
            </div>
            <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: 'red' }}>Retiro</h3>
              <input type="number" placeholder="Monto" value={montoRetiro} onChange={e => setMontoRetiro(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
              <button onClick={realizarRetiro} style={{ width: '100%', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none' }}>Retirar</button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3>Últimos movimientos</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                  <th>Fecha</th><th>Tipo</th><th>Monto</th><th>Sucursal</th><th>Saldo después</th>
>>>>>>> Stashed changes
                </tr>
              </thead>

              <tbody>
                {datos.movimientos.map((mov, idx) => (
<<<<<<< Updated upstream
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #ddd',
                      textAlign: 'center'
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      {new Date(mov.fecha).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '12px' }}>
                      {mov.tipo}
                    </td>

                    <td
                      style={{
                        padding: '12px',
                        color:
                          mov.tipo === 'depósito'
                            ? 'green'
                            : mov.tipo === 'retiro'
                            ? 'red'
                            : '#333',
                        fontWeight: 'bold'
                      }}
                    >
                      ${mov.monto.toFixed(2)}
                    </td>

                    <td style={{ padding: '12px' }}>
                      ${mov.saldo_despues?.toFixed(2)}
                    </td>
=======
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                    <td>{mov.tipo}</td>
                    <td style={{ color: mov.tipo === 'depósito' ? 'green' : mov.tipo === 'retiro' ? 'red' : '#333' }}>${mov.monto.toFixed(2)}</td>
                    <td>{mov.sucursal}</td>
                    <td>${mov.saldo_despues?.toFixed(2)}</td>
>>>>>>> Stashed changes
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}