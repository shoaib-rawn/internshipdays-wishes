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

The announcement keeps the personal office note through 9 October 2026 in Pakistan time. From 10 October, `daily-marquee.js` shows one daily Quran translation excerpt from a verified 14-quote rotation, with a link to the complete verse on Quran.com. It changes at midnight in Asia/Karachi, checks again when a tab returns to view, and needs no external API or daily deployment. The collection repeats after 14 days. Translation: Dr. Mustafa Khattab, The Clear Quran.

`page-entry.js` starts each visit, reload, and browser return at the hero, including URLs with an initial section fragment. Links clicked within the page still scroll smoothly. `celebration.css` animates the hero roses, and `celebration.js` shows transparent petals and confetti behind the video card only during playback. Pause, ending, buffering, or errors restore its usual background. Decorations never intercept player controls or change the card size, and respect reduced-motion preferences.
