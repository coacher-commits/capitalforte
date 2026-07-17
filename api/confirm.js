// Vercel Serverless Function — Confirmación del doble opt-in de Insights+
// Valida el enlace firmado que envía /api/subscribe y, si es correcto,
// añade el contacto a la lista Insights+ en Brevo. Luego muestra una página de éxito.

const crypto = require('crypto');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = 'https://nortecapital.es';

function confirmToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex');
}

function page(titulo, mensaje, cta) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo} · Norte Capital</title></head>
<body style="margin:0;padding:0;background:#0e5b43;font-family:Georgia,'Times New Roman',serif;color:#f5f1e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr><td align="center" style="padding:48px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td>
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:rgba(245,241,232,.7);font-family:Arial,sans-serif;">Norte Capital · Insights+</p>
          <h1 style="margin:0 0 16px;font-size:32px;line-height:1.15;font-weight:500;">${titulo}</h1>
          <p style="margin:0 0 28px;font-size:17px;line-height:1.6;color:rgba(245,241,232,.85);">${mensaje}</p>
          ${cta}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

module.exports = async function handler(req, res) {
  const apiKey = process.env.BREVO_API_KEY;
  const secret = process.env.CONFIRM_SECRET || apiKey;
  const listId = parseInt(process.env.BREVO_INSIGHTS_LIST_ID || '3', 10);

  const q = req.query || {};
  const email = String(q.e || '').trim().toLowerCase();
  const token = String(q.t || '');

  res.setHeader('content-type', 'text/html; charset=utf-8');

  const invalido = () =>
    res.status(400).send(page(
      'Enlace no válido',
      'Este enlace de confirmación no es válido o ha caducado. Vuelve a suscribirte en la web y te enviaremos uno nuevo.',
      `<a href="${SITE}/#insights" style="display:inline-block;padding:14px 26px;background:#f5f1e8;color:#0e5b43;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">Volver a la web</a>`
    ));

  if (!apiKey || !EMAIL_RE.test(email) || !token) return invalido();

  const expected = confirmToken(email, secret);
  let valido = false;
  try {
    valido = token.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch { valido = false; }
  if (!valido) return invalido();

  try {
    // updateEnabled:true -> crea el contacto si no existe, o lo actualiza, y lo mete en la lista
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    });
  } catch (err) {
    console.error('Error añadiendo contacto a Brevo:', err);
    // Aun así mostramos éxito al usuario; el alta se puede reintentar.
  }

  return res.status(200).send(page(
    '¡Suscripción confirmada!',
    'Ya estás dentro de Insights+. Recibirás un correo a la semana con análisis honesto de mercados, en lenguaje normal.',
    `<a href="${SITE}/" style="display:inline-block;padding:14px 26px;background:#f5f1e8;color:#0e5b43;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">Ir a la web</a>`
  ));
};
