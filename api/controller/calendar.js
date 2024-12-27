import { google } from "googleapis";

export async function createServiceCalendar() {
    const serviceAccountKeyJson = process.env.SERVICE_ACCOUNT_KEY_JSON;
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKeyJson),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const serviceAuth = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: serviceAuth });
    return calendar
}

export function createGoogleCalendarClient(access_token) {
  if (!access_token) {
    throw new Error('Access token no proporcionado.');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  oauth2Client.setCredentials({ access_token });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}


