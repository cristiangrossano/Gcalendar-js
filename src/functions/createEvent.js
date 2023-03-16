const moment = require("moment");
const readline = require("readline");

async function createEvent() {
  const fuso = "Europe/Rome";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // creazione oggetto evento
  const evento = {};
  evento.summary = await new Promise((resolve) =>
    rl.question("Inserisci il nome dell'evento: ", resolve)
  );

  //input data inizio
  const dataInizio = await new Promise((resolve) =>
    rl.question(
      "Inserisci il giorno di inizio con data in formato DD-MM-YYYY",
      resolve
    )
  );
  const oraInizio = await new Promise((resolve) =>
    rl.question("Inserisci l'ora di inizio in formato OO:MM", resolve)
  );

  //input data fine
  const dataFine = await new Promise((resolve) =>
    rl.question(
      "Inserisci il giorno di fine con data in formato DD-MM-YYYY",
      resolve
    )
  );
  const oraFine = await new Promise((resolve) =>
    rl.question("Inserisci l'ora di fine in formato OO:MM", resolve)
  );
  rl.close();

  // evento.start
  evento.start = {};
  evento.start.dateTime = moment(
    `${dataInizio}T${oraInizio}`,
    "DD-MM-YYYYTHH:mm"
  ).toISOString();
  evento.start.timeZone = fuso;

  //evento end
  evento.end = {};
  evento.end.dateTime = moment(
    `${dataFine}T${oraFine}`,
    "DD-MM-YYYYTHH:mm"
  ).toISOString();
  evento.end.timeZone = fuso;

  return evento;
}

module.exports = { createEvent };
