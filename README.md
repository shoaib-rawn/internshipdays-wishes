# Internship Days & Wishes

A small thank-you website for Shoaib Hassan's six-month PSEB internship at <span class="brand-name"><span class="brand-logic">LOGIC</span> <span class="brand-powered">POWERED</span></span>.

## Pages

- `index.html` — internship journey, memories, CV, photo, and the kinnow party invitation.
- `gaap-guide.html` — a plain-language guide to accounting behavior documented in the QuickBook ERP API.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. The site uses plain HTML, CSS, JavaScript, SVG assets, and a PDF résumé.

The contact form uses the Vercel Function at `/api/contact` to forward messages to FormSubmit. Local static previews show the form, but sending requires a Vercel deployment and an activated FormSubmit recipient address.

If FormSubmit rejects the server request with HTTP 403, the form submits through FormSubmit's browser AJAX endpoint without leaving the page. It does not retry uncertain failures or timeouts, to avoid duplicate messages. A failed submission preserves the visitor's draft and shows the service error.

## Server email setup

The contact API also supports Resend. Setting `RESEND_API_KEY` in Vercel switches delivery to Resend on the server, so the browser only contacts this website. A Resend error does not send a second copy through FormSubmit.

1. Create a Resend account using `shoaibhassan533q@gmail.com` and create a Sending Access API key at https://resend.com/api-keys.
2. In the `internshipdays-wishes` Vercel project, open Settings → Environment Variables. Add `RESEND_API_KEY` with the key value for Production.
3. Redeploy the latest Production deployment. Environment changes apply to new deployments.

The default sender is `Shoaib Portfolio <onboarding@resend.dev>`. Resend's default domain can send only to the address used for the Resend account, which is why the account must use the contact recipient above. For a verified custom sender, set `CONTACT_FROM_EMAIL` to that sender instead.

Keep the API key in Vercel's environment variables; never put it in browser JavaScript, Git, or a chat message. The API reports success only after Resend returns an email ID. Confirm final inbox receipt with an approved test after setup.

References: https://resend.com/docs/api-reference/emails/send-email and https://resend.com/docs/knowledge-base/403-error-resend-dev-domain.
