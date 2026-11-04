/**
 * Allied Restoration — teamallied.co contact form backend
 * Receives form POSTs and emails each submission to dispatch@teamallied.co.
 *
 * Deploy: Extensions/standalone Apps Script project > Deploy > New deployment
 *   Type: Web app | Execute as: Me | Who has access: Anyone
 * Then paste the web-app URL into var ENDPOINT in /contact/index.html
 */

var TO_EMAIL   = "dispatch@teamallied.co";
var SITE_NAME  = "Team Allied / Allied Restoration";

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    var name    = (p.name    || "").toString().trim();
    var phone   = (p.phone   || "").toString().trim();
    var email   = (p.email   || "").toString().trim();
    var service = (p.service || "").toString().trim();
    var message = (p.message || "").toString().trim();

    // Honeypot: silently accept bots without emailing (optional hidden "company" field)
    if ((p.company || "").toString().trim() !== "") {
      return json_({ ok: true });
    }

    // Minimal validation
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
    // Reply straight to the customer if they gave an email
    if (email) options.replyTo = email;

    MailApp.sendEmail(TO_EMAIL, subject, body, options);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// GET just confirms the script is live (open the URL in a browser to test)
function doGet() {
  return json_({ ok: true, status: "Allied Restoration form endpoint is live" });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
