/**
 * Allied Restoration — teamallied.co contact form backend (with spam protection)
 * Emails each submission to michael@teamallied.co.
 *
 * Spam protection, two layers:
 *   1. Honeypot — a hidden "company" field. Bots fill it; humans can't see it. Filled = silently dropped.
 *   2. Cloudflare Turnstile — a free CAPTCHA token verified server-side. No valid token = rejected.
 *
 * SETUP:
 *   - Paste TURNSTILE_SECRET below (from your Cloudflare Turnstile dashboard — the SECRET key, not the site key).
 *   - Deploy: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 *   - Paste the web-app URL into var ENDPOINT in /contact/index.html.
 */

var TO_EMAIL          = "michael@teamallied.co";
var SITE_NAME         = "Team Allied / Allied Restoration";
var TURNSTILE_SECRET  = "PASTE_YOUR_TURNSTILE_SECRET_KEY_HERE";  // from Cloudflare dashboard

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // --- Layer 1: honeypot ---
    // Real visitors never see or fill the hidden "company" field. If it's filled, it's a bot.
    if ((p.company || "").toString().trim() !== "") {
      return json_({ ok: true });  // pretend success so the bot moves on
    }

    // --- Layer 2: Cloudflare Turnstile verification ---
    // Only enforced if a secret key has been configured. Lets you deploy the honeypot first and add Turnstile later.
    if (TURNSTILE_SECRET && TURNSTILE_SECRET.indexOf("PASTE_") !== 0) {
      var token = (p["cf-turnstile-response"] || "").toString();
      if (!token) {
        return json_({ ok: false, error: "Verification required" });
      }
      var verify = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "post",
        payload: { secret: TURNSTILE_SECRET, response: token },
        muteHttpExceptions: true
      });
      var result = JSON.parse(verify.getContentText());
      if (!result.success) {
        return json_({ ok: false, error: "Verification failed" });
      }
    }

    // --- Collect fields ---
    var name    = (p.name    || "").toString().trim();
    var phone   = (p.phone   || "").toString().trim();
    var email   = (p.email   || "").toString().trim();
    var service = (p.service || "").toString().trim();
    var message = (p.message || "").toString().trim();

    if (!name || (!phone && !email)) {
      return json_({ ok: false, error: "Missing required fields" });
    }

    var subject = "New service request — " + (service || "General") + " — " + name;
    var body =
      "New contact form submission from teamallied.co\n\n" +
      "Name:    " + name + "\n" +
      "Phone:   " + phone + "\n" +
      "Email:   " + email + "\n" +
      "Service: " + service + "\n\n" +
      "Message:\n" + (message || "(none)") + "\n\n" +
      "-------------------------------------------\n" +
      "Received: " + new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }) + "\n" +
      "Source:   " + SITE_NAME;

    var options = { name: SITE_NAME };
    if (email) options.replyTo = email;

    MailApp.sendEmail(TO_EMAIL, subject, body, options);
    return json_({ ok: true });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, status: "Allied Restoration form endpoint is live" });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
