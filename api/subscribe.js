// Vercel Serverless Function — Suscripción a Insights+ (doble opt-in con Brevo)
//
// Variables de entorno necesarias en Vercel (Project → Settings → Environment Variables):
//   BREVO_API_KEY          → tu API key de Brevo (Settings → SMTP & API → API Keys)
//   BREVO_INSIGHTS_LIST_ID → id numérico de la lista "Insights+" en Brevo (por defecto 3)
//
// Opcionales (tienen valor por defecto):
//   BREVO_DOI_TEMPLATE_ID  → id de la plantilla de confirmación (por defecto 2)
//   BREVO_REDIRECT_URL     → a dónde redirige tras confirmar (por defecto la home con ?insights=confirmado)

const BREVO_DOI_ENDPOINT = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_INSIGHTS_LIST_ID || '3', 10); // lista "Insights+"
  const templateId = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || '2', 10);
  const redirectionUrl =
    process.env.BREVO_REDIRECT_URL || 'https://nortecapital.es/?insights=confirmado';

  if (!apiKey || !listId) {
    console.error('Faltan variables de entorno: BREVO_API_KEY o BREVO_INSIGHTS_LIST_ID');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const email = (body && body.email ? String(body.email) : '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  try {
    const brevoRes = await fetch(BREVO_DOI_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [listId],
        templateId,
        redirectionUrl,
      }),
    });

    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return res.status(200).json({ ok: true });
    }

    const detail = await brevoRes.text();

    if (brevoRes.status === 400 && /already|exist/i.test(detail)) {
      return res.status(200).json({ ok: true, already: true });
    }

    console.error('Brevo DOI error', brevoRes.status, detail);
    return res.status(502).json({ ok: false, error: 'provider_error' });
  } catch (err) {
    console.error('Error llamando a Brevo:', err);
    return res.status(502).json({ ok: false, error: 'provider_unreachable' });
  }
};
