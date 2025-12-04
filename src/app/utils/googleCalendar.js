// src/app/utils/googleCalendar.js
import { google } from "googleapis";
import { parseISO } from "date-fns";

const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_JSON,
  PHOTOGRAPHER_TZ = "UTC",
  PHOTOGRAPHER_CALENDAR_ID,
} = process.env;

if (!PHOTOGRAPHER_CALENDAR_ID) {
  console.warn("PHOTOGRAPHER_CALENDAR_ID not set in env");
}

function normalizePrivateKey(key) {
  if (!key) return key;
  // If the private key was stored with literal "\n" sequences, convert them to newlines
  let normalized = key.replace(/\\n/g, "\n");
  // Trim whitespace
  normalized = normalized.trim();
  return normalized;
}

function loadServiceAccountFromJson(jsonStr) {
  try {
    const obj = typeof jsonStr === "string" ? JSON.parse(jsonStr) : jsonStr;
    if (obj.client_email && obj.private_key) {
      return {
        email: obj.client_email,
        key: normalizePrivateKey(obj.private_key),
      };
    }
  } catch (err) {
    // fall through
  }
  return null;
}

export function getCalendarClient() {
  let email, key;

  if (GOOGLE_SERVICE_ACCOUNT_JSON) {
    const parsed = loadServiceAccountFromJson(GOOGLE_SERVICE_ACCOUNT_JSON);
    if (parsed) {
      email = parsed.email;
      key = parsed.key;
    } else {
      throw new Error(
        "Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON. Ensure it's valid JSON with client_email and private_key fields."
      );
    }
  } else if (GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    email = GOOGLE_SERVICE_ACCOUNT_EMAIL;
    key = normalizePrivateKey(GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  } else {
    throw new Error(
      "Google service account not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON OR (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)."
    );
  }

  // Basic validation
  if (!email || !key) {
    throw new Error("Service account email or private key missing after normalization.");
  }

  // The google APIs client expects the private key in PEM format (-----BEGIN PRIVATE KEY----- ...).
  if (!key.includes("PRIVATE KEY")) {
    // This is a common mistake; give an actionable message
    throw new Error(
      "Private key does not look like a PEM-formatted key (missing 'PRIVATE KEY' header). " +
      "Make sure the key is a valid PEM. If you have a .p12, convert it with openssl or use the JSON key file."
    );
  }

  // Initialize JWT auth
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  return calendar;
}

/**
 * listEvents(startISO, endISO)
 * returns busy events from the photographer calendar
 */
export async function listEvents(startISO, endISO) {
  try {
    const calendar = getCalendarClient();

    console.log("✅ Google Calendar client initialized successfully");
    console.log(`📅 Fetching events from ${startISO} to ${endISO}`);

    const res = await calendar.events.list({
      calendarId: PHOTOGRAPHER_CALENDAR_ID,
      timeMin: startISO,
      timeMax: endISO,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 2500,
    });

    return res.data.items || [];
  } catch (error) {
    // Provide a helpful error message that surfaces the likely root cause
    console.error("❌ Error listing events:", error?.message || error);
    throw new Error(`Failed to list calendar events: ${error?.message || error}`);
  }
}

/**
 * checkAvailability(startISO, endISO)
 * Checks if a specific time slot is available (not overlapping with existing events)
 */
export async function checkAvailability(startISO, endISO) {
  try {
    const events = await listEvents(startISO, endISO);

    const requestedStart = parseISO(startISO);
    const requestedEnd = parseISO(endISO);

    const hasOverlap = events.some((event) => {
      const eventStart = parseISO(event.start.dateTime || event.start.date);
      const eventEnd = parseISO(event.end.dateTime || event.end.date);
      // Overlap exists if requestedStart < eventEnd AND requestedEnd > eventStart
      return requestedStart < eventEnd && requestedEnd > eventStart;
    });

    return !hasOverlap;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
}

/**
 * createEvent({summary, description, startISO, endISO, attendees})
 */
export async function createEvent({
  summary,
  description,
  startISO,
  endISO,
  attendees = [],
}) {
  const calendar = getCalendarClient();
  const event = {
    summary,
    description,
    start: { dateTime: startISO, timeZone: PHOTOGRAPHER_TZ },
    end: { dateTime: endISO, timeZone: PHOTOGRAPHER_TZ },
    attendees,
  };

  const res = await calendar.events.insert({
    calendarId: PHOTOGRAPHER_CALENDAR_ID,
    requestBody: event,
    sendUpdates: "none",
  });

  return res.data;
}
