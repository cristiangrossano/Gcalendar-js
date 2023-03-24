const chalk = require("chalk");

/**
 * Funzione che stampa numeroRisultati eventi dal calendario insieme alla loro data
 * @param {String} idCalendario
 * @param {Int} numeroRisultati
 */
async function listaEventi(calendar, idCalendario, numeroRisultati) {
  const res = await calendar.events.list({
    calendarId: idCalendario,
    timeMin: new Date().toISOString(),
    maxResults: numeroRisultati,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log(chalk.red("Nessun evento in programma trovato."));
  }
  console.log(
    chalk.blue(`Prossimi ${numeroRisultati} eventi in calendario.\n`)
  );

  //* Print
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(
      chalk.blue(`${new Date(start.slice(0, -6))} - ${event.summary}`)
    );
  });
}

module.exports = { listaEventi };
