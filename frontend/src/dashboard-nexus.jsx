import { useState } from 'react';

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [montoDeposito, setMontoDeposito] = useState('');
  const [montoRetiro, setMontoRetiro] = useState('');

  const consultarCuenta = async () => {
    if (!cuenta.trim()) return;

    setError('');
    setMensaje('');

    try {
      const res = await fetch(`http://localhost:3001/api/cuenta/${cuenta}`);

      if (!res.ok) {
        throw new Error('Cuenta no encontrada');
      }

      const data = await res.json();
      setDatos(data);

    } catch (err) {
      setError(err.message);
      setDatos(null);
    }
  };

  const realizarDeposito = async () => {
    setError('');
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/api/deposito', {
        method: 'POST',
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
      setMontoDeposito('');

      consultarCuenta();

    } catch (err) {
      setError(err.message);
    }
  };

  const realizarRetiro = async () => {
    setError('');
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/api/retiro', {
        method: 'POST',
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
      setMontoRetiro('');

      consultarCuenta();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
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
                </tr>
              </thead>

              <tbody>
                {datos.movimientos.map((mov, idx) => (
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