const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const readline = require("readline");
const chalk = require("chalk");

const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(process.cwd(), "jsons/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "jsons/credentials.json");

// import delle funzioni
const { listaEventi } = require("./functions/listEvents");
const { aggiuntaEvento } = require("./functions/newEvent");

/**
 * Legge le precedenti credenziali che sono state autorizzate dal file salvato.
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
 * Serializza le credenziali in un file compatibile con GoogleAUth.fromJSON.
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
 * Carica o richiede o autorizza la chiamata API.
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
 * Gestisce eventi nel calendario dell'utente
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 *
 */
async function action(auth) {
  const calendar = google.calendar({ version: "v3", auth });

  console.log(chalk.magenta("Benvenuto in " + chalk.blue("Gcalendar") + "."));
  console.log(
    chalk.magenta(
      "Con questo script è possibile visualizzare eventi in Google Calendar e crearne di nuovi."
    )
  );

  // apertura scanner
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * Funzione che stampa in console le domande e prende in input la scelta
   *  @returns scelta
   */
  function getInput() {
    return new Promise((resolve) => {
      rl.question(
        chalk.magenta(
          "Cosa vuoi fare?\n1. Visualizzare i prossimi eventi.\n2. Aggiungere un evento.\n0. Per uscire.\n"
        ),
        (input) => {
          resolve(input.trim());
        }
      );
    });
  }

  do {
    scelta = await getInput();

    if (scelta == "1") {
      rl.question(
        chalk.blue("Quanti eventi vuoi visualizzare?\n"),
        async function (nRisultati) {
          rl.close();
          await listaEventi(calendar, "primary", nRisultati.trim());
        }
      );
    } else if (scelta == "2") {
      rl.close();
      await aggiuntaEvento(calendar, "primary");
    } else if (scelta != "0") {
      console.log(chalk.red("ERRORE: Scelta non valida"));
    }
  } while (scelta != "0");
  rl.close();
  console.log(chalk.magenta("Grazie per aver usato Gcalendar\n"));
}

//* Esecuzione effettiva
authorize().then(action).catch(console.error);
