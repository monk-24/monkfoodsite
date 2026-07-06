/**
 * Monk Food — Contact form → Google Sheets
 * ------------------------------------------------------------------
 * This runs on Google Apps Script (script.google.com), NOT on your
 * website. It receives the contact form submission and appends a row
 * to your Google Sheet.
 *
 * SETUP (full walkthrough in README.md):
 *  1. Create a Google Sheet. Note its name of the first tab (default "Sheet1").
 *  2. Extensions → Apps Script. Delete any code and paste THIS file.
 *  3. (Optional) change SHEET_NAME below if your tab isn't "Sheet1".
 *  4. (Optional) set NOTIFY_EMAIL to get an email on every new lead.
 *  5. Deploy → New deployment → type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Copy the Web app URL.
 *  6. Paste that URL into assets/main.js → SHEETS_ENDPOINT.
 * ------------------------------------------------------------------
 */

var SHEET_NAME = "Sheet1";                 // tab that stores submissions
var NOTIFY_EMAIL = "monkfoodanalystic@gmail.com"; // set to "" to disable email alerts

// Column order written to the sheet
var HEADERS = [
  "Timestamp", "Name", "Business", "Email", "Phone",
  "Business Type", "Interested In", "Message", "Source"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Ensure a header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var p = (e && e.parameter) ? e.parameter : {};
    var row = [
      p.submittedAt || new Date().toISOString(),
      p.name || "",
      p.business || "",
      p.email || "",
      p.phone || "",
      p.type || "",
      p.interest || "",
      p.message || "",
      p.source || "website"
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: "New Monk Food enquiry: " + (p.business || p.name || "Website"),
          body:
            "Name: " + (p.name || "") + "\n" +
            "Business: " + (p.business || "") + "\n" +
            "Email: " + (p.email || "") + "\n" +
            "Phone: " + (p.phone || "") + "\n" +
            "Type: " + (p.type || "") + "\n" +
            "Interested in: " + (p.interest || "") + "\n\n" +
            "Message:\n" + (p.message || "")
        });
      } catch (mailErr) {
        // Email is best-effort; don't fail the submission if it errors.
      }
    }

    return json({ result: "success" });
  } catch (err) {
    return json({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Simple health check when opening the URL in a browser
function doGet() {
  return json({ result: "ok", service: "Monk Food contact endpoint" });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

