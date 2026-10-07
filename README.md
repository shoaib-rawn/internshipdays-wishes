# Internship Days & Wishes

A small thank-you website for Shoaib Hassan's six-month PSEB internship at <span class="brand-name"><span class="brand-logic">LOGIC</span> <span class="brand-powered">POWERED</span></span>.

## Pages

- `index.html` — internship journey, memories, CV, photo, and the kinnow party invitation.
- `gaap-guide.html` — a plain-language guide to accounting behavior documented in the QuickBook ERP API.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. The site uses plain HTML, CSS, JavaScript, SVG assets, and a PDF résumé.

The contact form uses the Vercel Function at `/api/contact` to forward messages to FormSubmit. Local static previews show the form, but sending requires a Vercel deployment and an activated FormSubmit recipient address.

If FormSubmit rejects the server request with HTTP 403, the form submits through FormSubmit's browser AJAX endpoint without leaving the page. It does not retry uncertain failures or timeouts, to avoid duplicate messages. A failed submission preserves the visitor's draft and shows the service error.
