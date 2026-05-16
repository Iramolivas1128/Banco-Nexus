import { useState } from 'react';

export default function DashboardBancoNexus() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [montoDeposito, setMontoDeposito] = useState('');
  const [montoRetiro, setMontoRetiro] = useState('');
  const [sucursal, setSucursal] = useState('CDMX');

  // ======================================
  // CONSULTAR CUENTA
  // ======================================
  const consultarCuenta = async () => {
    if (!cuenta.trim()) return;
    setError('');
    setMensaje('');

    try {
      const res = await fetch(
        `http://localhost:3001/api/cuenta/${cuenta}`
      );

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

  // ======================================
  // DEPÓSITO
  // ======================================
  const realizarDeposito = async () => {
    setError('');
    setMensaje('');

    try {
      const res = await fetch(
        'http://localhost:3001/api/deposito',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cuenta_numero: cuenta,
            monto: parseFloat(montoDeposito),
            sucursal
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Error en depósito'
        );
      }

      setMensaje(
        `Depósito realizado desde sucursal ${sucursal}`
      );
      setMontoDeposito('');
      consultarCuenta();
    } catch (err) {
      setError(err.message);
    }
  };

  // ======================================
  // RETIRO
  // ======================================
  const realizarRetiro = async () => {
    setError('');
    setMensaje('');

    try {
      const res = await fetch(
        'http://localhost:3001/api/retiro',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cuenta_numero: cuenta,
            monto: parseFloat(montoRetiro),
            sucursal
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Error en retiro'
        );
      }

      setMensaje(
        `Retiro realizado desde sucursal ${sucursal}`
      );
      setMontoRetiro('');
      consultarCuenta();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '40px auto',
        padding: '30px',
        fontFamily: 'Arial',
        backgroundColor: '#f4f7fb',
        borderRadius: '14px',
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

      {/* CONSULTA */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
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

        <select
          value={sucursal}
          onChange={(e) => setSucursal(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="CDMX">CDMX</option>
          <option value="GUADALAJARA">GUADALAJARA</option>
          <option value="MONTERREY">MONTERREY</option>
          <option value="LA_PAZ">LA PAZ</option>
          <option value="TIJUANA">TIJUANA</option>
        </select>

        <button
          onClick={consultarCuenta}
          style={{
            padding: '12px 20px',
            backgroundColor: '#1565c0',
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
            textAlign: 'center'
          }}
        >
          {error}
        </p>
      )}

      {mensaje && (
        <p
          style={{
            color: 'green',
            textAlign: 'center'
          }}
        >
          {mensaje}
        </p>
      )}

      {datos && (
        <>
          {/* DATOS CUENTA */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '25px'
            }}
          >
            <h2>{datos.cliente}</h2>
            <p>
              <strong>Cuenta:</strong> {datos.cuenta}
            </p>
            <p>
              <strong>Tipo:</strong> {datos.tipo}
            </p>
            <p
              style={{
                fontSize: '26px',
                color: '#0d47a1',
                fontWeight: 'bold'
              }}
            >
              Saldo: ${datos.saldo.toFixed(2)} MXN
            </p>
          </div>

          {/* OPERACIONES */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '30px'
            }}
          >
            {/* DEPÓSITO */}
            <div
              style={{
                flex: 1,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ color: 'green' }}>
                Depósito
              </h3>
              <input
                type="number"
                placeholder="Monto"
                value={montoDeposito}
                onChange={(e) =>
                  setMontoDeposito(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px'
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
                  borderRadius: '8px'
                }}
              >
                Depositar
              </button>
            </div>

            {/* RETIRO */}
            <div
              style={{
                flex: 1,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ color: 'red' }}>
                Retiro
              </h3>
              <input
                type="number"
                placeholder="Monto"
                value={montoRetiro}
                onChange={(e) =>
                  setMontoRetiro(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px'
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
                  borderRadius: '8px'
                }}
              >
                Retirar
              </button>
            </div>
          </div>

          {/* MOVIMIENTOS */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px'
            }}
          >
            <h3>
              Historial de movimientos
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
                  <th style={{ padding: '12px' }}>
                    Fecha
                  </th>
                  <th style={{ padding: '12px' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '12px' }}>
                    Monto
                  </th>
                  <th style={{ padding: '12px' }}>
                    Saldo
                  </th>
                  <th style={{ padding: '12px' }}>
                    Sucursal
                  </th>
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
                      {new Date(mov.fecha).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {mov.tipo}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 'bold',
                        color:
                          mov.tipo === 'depósito'
                            ? 'green'
                            : mov.tipo === 'retiro'
                            ? 'red'
                            : '#333'
                      }}
                    >
                      ${mov.monto.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      ${mov.saldo_despues?.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {mov.sucursal || 'MATRIZ'}
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