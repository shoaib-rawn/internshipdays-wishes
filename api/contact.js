const FORM_ENDPOINT = 'https://formsubmit.co/ajax/shoaibhassan533q@gmail.com';
const SITE_URL = 'https://internshipdays-wishes.vercel.app/';
const RECIPIENT = 'shoaibhassan533q@gmail.com';

async function sendWithResend({ name, email, message }, response) {
  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Shoaib Portfolio <onboarding@resend.dev>',
        to: [RECIPIENT],
        reply_to: email,
        subject: 'New portfolio message for Shoaib Hassan',
        text: `Name: ${name}\nEmail: ${email}\nWebsite: ${SITE_URL}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || typeof result?.id !== 'string' || !result.id.trim()) {
      console.error('Contact email rejected:', { status: upstream.status, reason: result?.name || 'Invalid provider response' });
      const configurationError = upstream.status === 401 || upstream.status === 403;
      return response.status(configurationError ? 503 : 502).json({
        success: false,
        code: configurationError ? 'MAIL_CONFIGURATION_ERROR' : 'DELIVERY_REJECTED',
        message: configurationError
          ? 'The contact form is awaiting email setup. Your message is still in the form.'
          : 'The message service could not accept your message. Your message is still in the form; please try again later.',
      });
    }
    return response.status(200).json({ success: true });
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    console.error('Contact email request failed:', { name: error.name, cause: error.cause?.code });
    return response.status(timedOut ? 504 : 502).json({
      success: false,
      code: timedOut ? 'DELIVERY_TIMEOUT' : 'DELIVERY_UNAVAILABLE',
      message: 'We could not confirm delivery. Your message is still in the form; please try again later.',
    });
  }
}

module.exports = async function contact(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  // Report the selected service for setup checks without exposing any key.
  response.setHeader('X-Contact-Provider', process.env.RESEND_API_KEY?.trim() ? 'resend' : 'formsubmit');

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

  if (fields._honey) {
    return response.status(400).json({ success: false, message: 'Please leave the extra field empty and try again.' });
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return sendWithResend({ name, email, message }, response);
  }

  const payload = {
    name,
    email,
    message,
    _subject: 'New portfolio message for Shoaib Hassan',
    _template: 'table',
    _replyto: email,
    _url: SITE_URL,
  };

  try {
    const upstream = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: SITE_URL,
        Origin: new URL(SITE_URL).origin,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const result = await upstream.json().catch(() => null);
    const providerMessage = typeof result?.message === 'string' ? result.message.slice(0, 350) : '';
    if (/activat|confirm (?:your |the )?email|verification/i.test(providerMessage)) {
      console.error('Contact form needs activation:', providerMessage);
      return response.status(503).json({
        success: false,
        code: 'FORM_NOT_ACTIVATED',
        message: 'This contact form is awaiting email activation. Please try again after the site owner activates it.',
      });
    }
    if (!upstream.ok || (result?.success !== true && result?.success !== 'true')) {
      console.error('Contact delivery rejected:', { status: upstream.status, message: providerMessage || 'No JSON response' });
      return response.status(502).json({
        success: false,
        // A 403 confirms this server request was rejected before acceptance.
        // The client may then use FormSubmit's supported browser AJAX endpoint.
        code: upstream.status === 403 ? 'DIRECT_SUBMISSION_REQUIRED' : 'DELIVERY_REJECTED',
        providerStatus: upstream.status,
        message: providerMessage || 'The message service could not accept your message. Please try again later.',
      });
    }
    return response.status(200).json({ success: true });
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    console.error('Contact provider request failed:', { name: error.name, cause: error.cause?.code });
    return response.status(timedOut ? 504 : 502).json({
      success: false,
      code: timedOut ? 'DELIVERY_TIMEOUT' : 'DELIVERY_UNAVAILABLE',
      message: timedOut
        ? 'The message service took too long to respond. We could not confirm delivery; your message is still in the form.'
        : 'The message service is temporarily unavailable. Your message is still in the form; please try again later.',
    });
  }
};
