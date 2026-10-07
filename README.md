# Internship Days & Wishes

A small thank-you website for Shoaib Hassan's six-month PSEB internship at <span class="brand-name"><span class="brand-logic">LOGIC</span> <span class="brand-powered">POWERED</span></span>.

## Pages

- `index.html` — internship journey, memories, CV, photo, and the kinnow party invitation.
- `gaap-guide.html` — a plain-language guide to accounting behavior documented in the QuickBook ERP API.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. The site uses plain HTML, CSS, JavaScript, SVG assets, and a PDF résumé.

The contact form submits directly from the browser to FormSubmit's AJAX endpoint and shows the result on this page. The recipient is `shoaibhassan533q@gmail.com`, which must be activated through FormSubmit's confirmation email.

Submissions use FormSubmit's JSON AJAX format and include the site URL and visitor's reply address. The form accepts both boolean and string success confirmations, preserves the visitor's draft after errors, and sends each submission once. Sending requires access to FormSubmit from the visitor's network.

Documentation: https://formsubmit.co/ajax-documentation.
