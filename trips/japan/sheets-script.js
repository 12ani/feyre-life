// ─────────────────────────────────────────────────────────────────────────────
// Japan Expenses — Google Apps Script
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO SET THIS UP IN GOOGLE SHEETS
// ─────────────────────────────────────
// 1. Open your Google Sheet (Japan Expenses 2026)
// 2. Click Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Deploy → New deployment
//      - Type: Web app
//      - Execute as: Me
//      - Who has access: Anyone
// 5. Click Deploy → copy the URL (ends in /exec)
// 6. Paste that URL into spending-tracker.html:
//      const SCRIPT_URL = "AKfycbykfplmXjtY545_D-L2lpPfLj5kVUBwaKJA8ypfrt_Asu_AaHYpa6YQEoADGd2s9A9L/exec";
// 7. Commit and push spending-tracker.html
//
// REDEPLOYING AFTER CHANGES
// ──────────────────────────
// After editing this script you must redeploy:
//   Deploy → Manage deployments → pencil icon → New version → Deploy
// Then update SCRIPT_URL in spending-tracker.html with the new URL.
//
// SHEET COLUMNS (auto-created on first expense)
// ───────────────────────────────────────────────
// A: Date | B: Description | C: Category | D: Amount (¥) |
// E: Amount ($) | F: Note | G: Added At | H: ID
//
// EXCHANGE RATE
// ──────────────
// Live rate is fetched from open.er-api.com (free, no API key, updates daily).
// If the fetch fails, it falls back to a hardcoded rate (0.0067 ≈ 149 JPY/$1).
// Update the fallback rate below if needed.
// ─────────────────────────────────────────────────────────────────────────────

function getLiveRate() {
  try {
    var response = UrlFetchApp.fetch("https://open.er-api.com/v6/latest/USD");
    var data = JSON.parse(response.getContentText());
    return 1 / data.rates.JPY;
  } catch (e) {
    return 0.0067; // fallback: ~149 JPY per USD
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // DELETE action — finds row by ID and removes it
  if (e.parameter.action === "delete") {
    var id = e.parameter.id;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][7]) === String(id)) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ADD action — appends a new row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Description", "Category", "Amount (¥)", "Amount ($)", "Note", "Added At", "ID"]);
  }

  sheet.appendRow([
    e.parameter.date,
    e.parameter.desc,
    e.parameter.cat,
    e.parameter.jpy,
    (parseFloat(e.parameter.jpy) * getLiveRate()).toFixed(2),
    e.parameter.note || "",
    new Date().toLocaleString(),
    e.parameter.id
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
