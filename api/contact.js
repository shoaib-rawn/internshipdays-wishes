const FORM_ENDPOINT = 'https://formsubmit.co/ajax/shoaibhassan533q@gmail.com';

module.exports = async function contact(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  let fields = request.body;
  if (typeof fields === 'string') {
    try {
      fields = JSON.parse(fields);
    } catch {
      return response.status(400).json({ success: false, message: 'Invalid message.' });
    }
  }

  const name = typeof fields?.name === 'string' ? fields.name.trim() : '';
  const email = typeof fields?.email === 'string' ? fields.email.trim() : '';
  const message = typeof fields?.message === 'string' ? fields.message.trim() : '';
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 5000) {
    return response.status(400).json({ success: false, message: 'Please check your name, email and message.' });
  }

  const pageUrl = request.headers?.referer || (request.headers?.host ? `https://${request.headers.host}/` : '');
  const payload = {
    name,
    email,
    message,
    _subject: 'New portfolio message for Shoaib Hassan',
    _template: 'table',
    _honey: typeof fields?._honey === 'string' ? fields._honey : '',
    ...(pageUrl ? { _url: pageUrl } : {}),
  };

  try {
    const upstream = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || (result?.success !== true && result?.success !== 'true')) {
      return response.status(502).json({ success: false, message: 'The message service could not confirm delivery. Please try again later.' });
    }
    return response.status(200).json({ success: true });
  } catch {
    return response.status(502).json({ success: false, message: 'The message service is unavailable. Please try again later.' });
  }
};
