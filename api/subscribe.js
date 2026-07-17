// Vercel Serverless Function — Suscripción a Insights+
// Doble opt-in PROPIO (sin depender del DOI nativo de Brevo):
//   1. El visitante se suscribe -> se le envía un email transaccional con un enlace firmado.
//   2. Al pulsar el enlace, /api/confirm valida la firma y añade el contacto a la lista Insights+.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   BREVO_API_KEY           → API key de Brevo (obligatoria)
//   CONFIRM_SECRET          → (opcional) secreto para firmar el enlace; si falta se usa BREVO_API_KEY
//   BREVO_INSIGHTS_LIST_ID  → (opcional) id de la lista Insights+ (por defecto 3)

const crypto = require('crypto');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = 'https://nortecapital.es';
const SENDER = { name: 'Norte Capital', email: 'hola@nortecapital.es' };

function confirmToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex');
}

function confirmEmailHtml(url) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f4ef;font-family:Georgia,'Times New Roman',serif;color:#1d2a25;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ef;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e3ded2;">
        <tr><td style="padding:36px 40px 28px;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#0e5b43;font-family:Arial,sans-serif;">Norte Capital · Insights+</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;font-weight:600;">Un clic y estás dentro.</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Has pedido suscribirte a <strong>Insights+</strong>: un correo a la semana con análisis honesto de mercados —tradicionales y cripto— en lenguaje normal. Sin spam y sin venderte nada.</p>
          <p style="margin:0 0 28px;font-size:16px;line-height:1.6;">Para confirmar que este correo es tuyo, pulsa el botón:</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#0e5b43;">
            <a href="${url}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:16px;font-family:Arial,sans-serif;">Confirmar suscripción</a>
          </td></tr></table>
          <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#6b7570;">Si el botón no funciona, copia y pega esta dirección en tu navegador:<br><span style="color:#0e5b43;word-break:break-all;">${url}</span></p>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#6b7570;">Si no has solicitado esta suscripción, ignora este correo y no volverás a saber de nosotros.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #e3ded2;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8a857a;font-family:Arial,sans-serif;">© 2026 Norte Capital · nortecapital.es<br>El contenido de Insights+ es formativo e informativo y no constituye una recomendación personalizada de inversión.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const secret = process.env.CONFIRM_SECRET || apiKey;
  if (!apiKey) {
    console.error('Falta BREVO_API_KEY');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = (body && body.email ? String(body.email) : '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const token = confirmToken(email, secret);
  const url = `${SITE}/api/confirm?e=${encodeURIComponent(email)}&t=${token}`;

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email }],
        subject: 'Confirma tu suscripción a Insights+',
        htmlContent: confirmEmailHtml(url),
        tags: ['insights-doi'],
      }),
    });

    if (brevoRes.status === 201 || brevoRes.status === 202) {
      return res.status(200).json({ ok: true });
    }
    const detail = await brevoRes.text();
    console.error('Brevo smtp/email error', brevoRes.status, detail);
    return res.status(502).json({ ok: false, error: 'provider_error' });
  } catch (err) {
    console.error('Error llamando a Brevo:', err);
    return res.status(502).json({ ok: false, error: 'provider_unreachable' });
  }
};
