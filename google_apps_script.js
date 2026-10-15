/**

 * ==============================================================================

 * NEXUS SESSION 01 — PRODUCTION GOOGLE APPS SCRIPT ENDPOINT

 * Session: NEXUS-LVL1-SEC01

 * ==============================================================================

 * 

 * Target Google Sheet Schema (Exact Column Order):

 * A — Timestamp (Server date/time)

 * B — Full Name

 * C — Phone (Preserved text with leading zeros)

 * D — Session ID

 * E — Attempt ID

 * F — Score (Numeric)

 * G — Percentage (Decimal / Percentage formatted)

 * H — Start Time (Date/Time object)

 * I — Submission Time (Date/Time object)

 * J — Time Taken (Duration formatted as [h]:mm:ss)

 */



// ================================= CONFIGURATION ==============================

const CONFIG = {

  // Expected Session Identifier for Session 01

  EXPECTED_SESSION_ID: 'NEXUS-LVL1-SEC01',



  // Sheet tab name to record responses in (Default: 'Submissions' or active sheet)

  SHEET_NAME: 'Submissions',



  // Max wait time for concurrency lock (in milliseconds)

  LOCK_TIMEOUT_MS: 10000,



  // Optional: Set specific spreadsheet ID if running as standalone script.

  // Leave empty ("") if this script is attached directly to the Google Sheet (Container-bound).

  SPREADSHEET_ID: ''

};



// ============================== MAIN POST HANDLER =============================



/**

 * Handles HTTP POST requests containing quiz submission JSON payloads.

 * @param {Object} e - HTTP event object provided by Google Apps Script.

 * @returns {TextOutput} JSON response object.

 */

function doPost(e) {

  const lock = LockService.getScriptLock();



  try {

    // 1. Verify request payload existence

    if (!e || !e.postData || !e.postData.contents) {

      return createJsonResponse(false, 'Invalid request: No payload content received.');

    }



    // 2. Parse JSON payload safely

    let data;

    try {

      data = JSON.parse(e.postData.contents);

    } catch (parseError) {

      return createJsonResponse(false, 'Malformed JSON payload.');

    }



    // 3. Extract and normalize incoming fields

    const fullName = (data.fullName || '').toString().trim();

    const phoneNumber = (data.phoneNumber || data.phone || '').toString().trim();

    const sessionId = (data.sessionId || '').toString().trim();

    const attemptId = (data.attemptId || '').toString().trim();

    const score = data.score;

    const startTime = (data.startTime || '').toString().trim();

    const submissionTime = (data.submissionTime || '').toString().trim();

    const timeTaken = (data.timeTaken || '').toString().trim();



    // 4. Validate Required Fields

    if (!fullName) {

      return createJsonResponse(false, 'Validation error: "fullName" is required.');

    }

    if (!phoneNumber) {

      return createJsonResponse(false, 'Validation error: "phoneNumber" is required.');

    }

    if (!sessionId) {

      return createJsonResponse(false, 'Validation error: "sessionId" is required.');

    }

    if (!attemptId) {

      return createJsonResponse(false, 'Validation error: "attemptId" is required.');

    }

    if (score === undefined || score === null || isNaN(Number(score))) {

      return createJsonResponse(false, 'Validation error: Valid "score" is required.');

    }

    if (!startTime) {

      return createJsonResponse(false, 'Validation error: "startTime" is required.');

    }

    if (!submissionTime) {

      return createJsonResponse(false, 'Validation error: "submissionTime" is required.');

    }

    if (!timeTaken) {

      return createJsonResponse(false, 'Validation error: "timeTaken" is required.');

    }



    // 5. Validate Session ID Match

    if (sessionId !== CONFIG.EXPECTED_SESSION_ID) {

      return createJsonResponse(

        false, 

        'Validation error: Invalid session ID. Expected "' + CONFIG.EXPECTED_SESSION_ID + '".'

      );

    }



    // 6. Acquire Script Lock to prevent race-conditions on duplicate check & append

    const hasLock = lock.tryLock(CONFIG.LOCK_TIMEOUT_MS);

    if (!hasLock) {

      return createJsonResponse(

        false, 

        'Server busy: Could not acquire write lock. Please retry submission.'

      );

    }



    // 7. Get Target Sheet

    const sheet = getTargetSheet();

    if (!sheet) {

      return createJsonResponse(false, 'Server error: Target spreadsheet could not be opened.');

    }



    // Initialize Headers if Sheet is completely empty

    initializeHeadersIfEmpty(sheet);



    // 8. Prevent Duplicate Submissions by searching attemptId in Column E (Attempt ID, Column Index 5)

    const isDuplicate = checkDuplicateAttempt(sheet, attemptId);

    if (isDuplicate) {

      return createJsonResponse(

        false, 

        'Duplicate submission: Attempt ID "' + attemptId + '" has already been recorded.'

      );

    }



    // 9. Format Data for the Exact 10-Column Schema

    // A — Timestamp: Server timestamp Date object

    const serverTimestamp = new Date();



    // B — Full Name: Clean string

    // C — Phone: String prepended with apostrophe to strictly preserve leading zeros in Sheets

    const formattedPhone = "'" + phoneNumber;



    // D — Session ID: String

    // E — Attempt ID: String

    // F — Score: Numeric value

    const numericScore = Number(score);



    // G — Percentage: Numeric decimal (e.g. 0.9 for 90%) compatible with Sheet's Percentage column formatting

    const percentageDecimal = numericScore / 100;



    // H — Start Time: Date/time value compatible with Sheet format

    const startDateObj = parseDateSafely(startTime);



    // I — Submission Time: Date/time value compatible with Sheet format

    const submissionDateObj = parseDateSafely(submissionTime);



    // J — Time Taken: Duration formatted as [h]:mm:ss (e.g. "00:03:15")

    const formattedDurationHms = calculateDurationHms(startDateObj, submissionDateObj, timeTaken);



    // EXACT 10-COLUMN ROW:

    const newRow = [

      serverTimestamp,       // A — Timestamp

      fullName,              // B — Full Name

      formattedPhone,        // C — Phone

      sessionId,             // D — Session ID

      attemptId,             // E — Attempt ID

      numericScore,          // F — Score

      percentageDecimal,     // G — Percentage

      startDateObj,          // H — Start Time

      submissionDateObj,     // I — Submission Time

      formattedDurationHms   // J — Time Taken

    ];



    sheet.appendRow(newRow);



    // 10. Return Success Response

    return createJsonResponse(true, 'Submission recorded successfully', {

      attemptId: attemptId,

      recordedAt: serverTimestamp.toISOString()

    });



  } catch (error) {

    return createJsonResponse(false, 'Internal server error: ' + error.message);

  } finally {

    // Always release the lock

    lock.releaseLock();

  }

}



// ============================== HEALTH CHECK GET ==============================



/**

 * Handles HTTP GET requests for endpoint health check and verification.

 */

function doGet(e) {

  return createJsonResponse(true, 'NEXUS Session 01 Apps Script Endpoint is active.', {

    session: CONFIG.EXPECTED_SESSION_ID,

    status: 'READY',

    timestamp: new Date().toISOString()

  });

}



// ============================== HELPER FUNCTIONS ==============================



/**

 * Creates standardized JSON TextOutput.

 * @param {boolean} success - Operation status.

 * @param {string} message - Response message.

 * @param {Object} [extra] - Optional payload details.

 * @returns {TextOutput}

 */

function createJsonResponse(success, message, extra) {

  const payload = {

    success: success,

    message: message

  };



  if (extra && typeof extra === 'object') {

    Object.assign(payload, extra);

  }



  return ContentService

    .createTextOutput(JSON.stringify(payload))

    .setMimeType(ContentService.MimeType.JSON);

}



/**

 * Retrieves the target Google Sheet instance.

 * @returns {Sheet|null}

 */

function getTargetSheet() {

  let spreadsheet;



  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== '') {

    spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID.trim());

  } else {

    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  }



  if (!spreadsheet) return null;



  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {

    // If specific sheet name doesn't exist, use the active or first sheet

    sheet = spreadsheet.getActiveSheet() || spreadsheet.getSheets()[0];

  }



  return sheet;

}



/**

 * Ensures header row exists if sheet is new or empty.

 * @param {Sheet} sheet

 */

function initializeHeadersIfEmpty(sheet) {

  if (sheet.getLastRow() === 0) {

    const headers = [

      'Timestamp',

      'Full Name',

      'Phone',

      'Session ID',

      'Attempt ID',

      'Score',

      'Percentage',

      'Start Time',

      'Submission Time',

      'Time Taken'

    ];

    sheet.appendRow(headers);

    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  }

}



/**

 * Checks whether an attemptId already exists in Column E (Attempt ID, 5th column) to prevent duplicates.

 * @param {Sheet} sheet

 * @param {string} attemptId

 * @returns {boolean} True if duplicate, false otherwise.

 */

function checkDuplicateAttempt(sheet, attemptId) {

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {

    return false; // Only header or empty

  }



  // Column E corresponds to Attempt ID (Column Index 5, 1-indexed)

  const attemptValues = sheet.getRange(2, 5, lastRow - 1, 1).getValues();

  for (let i = 0; i < attemptValues.length; i++) {

    if (attemptValues[i][0] && attemptValues[i][0].toString().trim() === attemptId) {

      return true;

    }

  }



  return false;

}



/**

 * Parses an ISO or timestamp string into a Date object or returns fallback.

 * @param {string} dateStr

 * @returns {Date|string}

 */

function parseDateSafely(dateStr) {

  if (!dateStr) return new Date();

  const d = new Date(dateStr);

  return isNaN(d.getTime()) ? dateStr : d;

}



/**

 * Calculates duration string formatted as [h]:mm:ss (e.g. 00:03:15).

 * @param {Date|string} startDate

 * @param {Date|string} endDate

 * @param {string} fallbackStr

 * @returns {string} Duration formatted as hh:mm:ss

 */

function calculateDurationHms(startDate, endDate, fallbackStr) {

  const start = (startDate instanceof Date && !isNaN(startDate.getTime())) ? startDate : new Date(startDate);

  const end = (endDate instanceof Date && !isNaN(endDate.getTime())) ? endDate : new Date(endDate);



  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {

    const diffSec = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));

    const hours = Math.floor(diffSec / 3600);

    const minutes = Math.floor((diffSec % 3600) / 60);

    const seconds = diffSec % 60;



    const pad = function(n) { return (n < 10 ? '0' : '') + n; };

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);

  }



  return fallbackStr || '00:00:00';

}



// ============================== OFFLINE / IN-EDITOR TEST ======================



/**

 * Test function you can run directly inside the Apps Script Editor

 * to verify the exact 10-column schema output, duplicate rejection, and row appending.

 */

function testSubmissionEndpoint() {

  Logger.log('--- RUNNING APPS SCRIPT LOCAL TEST (10-COLUMN SCHEMA) ---');



  const testAttemptId = 'test_attempt_' + Date.now();



  // Test Case 1: Valid Submission

  const validPayload = {

    fullName: 'Ahmed Ali',

    phoneNumber: '01012345678',

    sessionId: 'NEXUS-LVL1-SEC01',

    attemptId: testAttemptId,

    score: 90,

    startTime: new Date(Date.now() - 195000).toISOString(), // 3m 15s ago

    submissionTime: new Date().toISOString(),

    timeTaken: '3m 15s'

  };



  const mockPostEvent = {

    postData: {

      contents: JSON.stringify(validPayload)

    }

  };



  const response1 = JSON.parse(doPost(mockPostEvent).getContent());

  Logger.log('Test 1 (Valid Submission) Result: ' + JSON.stringify(response1));



  // Test Case 2: Duplicate Attempt Submission

  const response2 = JSON.parse(doPost(mockPostEvent).getContent());

  Logger.log('Test 2 (Duplicate Attempt) Result: ' + JSON.stringify(response2));



  // Test Case 3: Missing Full Name

  const invalidPayload = Object.assign({}, validPayload, { fullName: '' });

  const response3 = JSON.parse(doPost({ postData: { contents: JSON.stringify(invalidPayload) } }).getContent());

  Logger.log('Test 3 (Missing Name) Result: ' + JSON.stringify(response3));



  // Test Case 4: Invalid Session ID

  const wrongSessionPayload = Object.assign({}, validPayload, { attemptId: 'att_different', sessionId: 'INVALID-SEC' });

  const response4 = JSON.parse(doPost({ postData: { contents: JSON.stringify(wrongSessionPayload) } }).getContent());

  Logger.log('Test 4 (Wrong Session ID) Result: ' + JSON.stringify(response4));

}
