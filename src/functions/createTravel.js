const moment = require("moment");
const readline = require("readline");

/**
 * Funzione che presi in input gli eventi di un giorno calcola il tempo necessario per raggiungere
 * il luogo dell'evento
 */
async function createTravel(calendar) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  let viaggi = [];
  let viaggio;
  const fuso = "Europe/Rome";

  const data = await new Promise((resolve) =>
    rl.question(
      "\nInserisci il giorno in cui vuoi calcolare il tempo di viaggio con la data in formato DD-MM-YYYY: ",
      resolve
    )
  );

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: moment(`${data}T00:00`, "DD-MM-YYYYTHH:mm").toISOString(),
    timeMax: moment(`${data}T23:59`, "DD-MM-YYYYTHH:mm").toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("Nessun evento in programma trovato.");
    return;
  } else {
    events.map((event, i) => {
      if (event.location) {
        let tempoNecessario = 10;
        let inizio = moment(event.start.dateTime || event.start.date)
          .subtract(tempoNecessario + 1, "minutes")
          .toISOString();
        let fine = moment(event.start.dateTime || event.start.date)
          .subtract(1, "minutes")
          .toISOString();

        viaggio = {};
        viaggio.summary = `Viaggio per ${event.summary}`;
        viaggio.start = {
          dateTime: inizio,
          timeZone: fuso,
        };
        viaggio.end = {
          dateTime: fine,
          timeZone: fuso,
        };
      }
      viaggi.push(viaggio);
    });
  }
  return viaggi;
}

module.exports = { createTravel };
