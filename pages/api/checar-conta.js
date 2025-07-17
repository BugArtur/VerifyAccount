export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { cpf } = req.body;

  if (!cpf || typeof cpf !== 'string') {
    return res.status(400).json({ erro: 'CPF inválido' });
  }

  const payload = {
    Method: "GetAccount",
    PartnerId: 1746,
    BusinessUnitId: 1342,
    TaxNumber: cpf.replace(/\D/g, '')
  };

  const auth = Buffer.from(
    `${process.env.FITBANK_USER}:${process.env.FITBANK_PASS}`
  ).toString('base64');

  try {
    const response = await fetch("https://apiv2.fitbank.com.br/main/execute", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.Success === "true" && data.AccountData?.Accounts?.length > 0) {
      const contas = data.AccountData.Accounts.map(c => ({
        WL: c.Bank || c.SpbAccount?.Bank || null
      }));

      return res.status(200).json({
        possuiConta: true,
        nome: data.AccountData.Name,
        email: data.AccountData.Mail,
        contas
      });
    } else {
      return res.status(200).json({
        possuiConta: false,
        mensagem: data.Message || "CPF sem contas vinculadas"
      });
    }

  } catch (error) {
    console.error("Erro ao consultar FitBank:", error);
    return res.status(500).json({ erro: "Erro interno ao consultar conta" });
  }
}
