/**
 * Function that prints the next numeroRisultati events in the calendar with their date
 * @param {*} calendar
 * @param {String} idCalendario
 * @param {Int} numeroRisultati
 * @returns
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
    console.log("Nessun evento in programma trovato.");
    return;
  }
  console.log(`Prossimi ${numeroRisultati} eventi in calendario.\n`);
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${new Date(start.slice(0, -6))} - ${event.summary}\n`);
  });
}

module.exports = { listaEventi };
