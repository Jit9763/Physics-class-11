function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Extract parameters from the form submission
  var data = e.parameter;

  // Generate a row of data based on the question names
  // We assume the HTML form uses names like q1, q2, ... q35
  var row = [];

  // Add a timestamp as the first column
  row.push(new Date());

  // Loop through 35 questions
  for (var i = 1; i <= 35; i++) {
    var answer = data['q' + i] || "";
    row.push(answer);
  }

  // Append the row to the sheet
  sheet.appendRow(row);

  // Return a success response
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}