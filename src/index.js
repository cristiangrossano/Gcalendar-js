const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const readline = require("readline");

const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(process.cwd(), "jsons/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "jsons/credentials.json");

// import delle funzioni
const { listaEventi } = require("./functions/listEvents");
const { aggiuntaEvento } = require("./functions/addEvent");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
!TODO
1. Possibilità di fare un input dell'evento da parte dell'utente
2. Calcolo del percorso partendo da una location "casa"
3. Aggiunta di pomodoro timer all'interno del calendario
*/

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next n events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function action(auth) {
  const calendar = google.calendar({ version: "v3", auth });

  rl.question(
    "Cosa vuoi fare?\n1. Visualizzare i prossimi eventi.\n2. Aggiungere un evento.\n",
    async function (scelta) {
      switch (scelta.trim()) {
        case "1": {
          listaEventi(calendar, "primary", 5);
          rl.close();
          break;
        }
        case "2": {
          await aggiuntaEvento(calendar, "primary");
          rl.close();
          break;
        }
        default: {
          console.log("Scelta non valida");
          rl.close();
          break;
        }
      }
    }
  );
}

authorize().then(action).catch(console.error);
