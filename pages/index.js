import { useState } from 'react';

export default function Home() {
  const [cpf, setCpf] = useState('');
  const [resposta, setResposta] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultar = async () => {
    setResposta(null);
    setLoading(true);

    const resp = await fetch('/api/checar-conta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf })
    });

    const data = await resp.json();
    setResposta(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Consulta de Conta (FitBank)</h1>
      <input
        type="text"
        value={cpf}
        placeholder="Digite o CPF"
        onChange={e => setCpf(e.target.value)}
        style={{ padding: 8, fontSize: 16, width: '250px', marginRight: 10 }}
      />
      <button onClick={consultar} disabled={loading} style={{ padding: 8 }}>
        {loading ? 'Consultando...' : 'Consultar'}
      </button>

      {resposta && (
        <div style={{ marginTop: 20 }}>
          {resposta.possuiConta ? (
            <div>
              <p><strong>Nome:</strong> {resposta.nome}</p>
              <p><strong>Email:</strong> {resposta.email}</p>
              <p><strong>Contas:</strong></p>
              <ul>
                {resposta.contas.map((c, i) => (
                  <li key={i}>{c.WL} - {c.agencia} - {c.conta}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: 'red' }}>{resposta.mensagem}</p>
          )}
        </div>
      )}
    </div>
  );
}