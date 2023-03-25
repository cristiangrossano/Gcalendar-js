const moment = require("moment");
const readline = require("readline");

/**
 * prende in input due dati e calcola i minuti che ci sono nel mezzo
 * @param {Date} date1
 * @param {Date} date2
 * @returns minutes
 */
function getMinutesBetweenDates(date1, date2) {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  const minutes = Math.floor(diff / 1000 / 60);
  return minutes;
}

/**
 * Funzione che prende in input una data e due ore, calcola la quantità di cicli di pomodoro
 * basato su tempo di concentrazione e tempo di pausa
 *
 * @return {Object} events
 */
async function createPomodoro() {
  const fuso = "Europe/Rome";
  const eventi = [];

  let count = 0;
  let evento;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  const nome = await new Promise((resolve) =>
    rl.question(
      "Inserisci nome dell'attività di cui vuoi svolgere un pomodoro: ",
      resolve
    )
  );
  const concentrazione = await new Promise((resolve) =>
    rl.question("\nInserisci durata fase di concentrazione: ", resolve)
  );
  if (concentrazione > 60)
    return console.log(chalk.red("Errore: durata troppo lunga"));

  const pausa = await new Promise((resolve) =>
    rl.question("\nInserisci durata della pausa: ", resolve)
  );
  if (pausa > 60) return console.log(chalk.red("Errore: durata troppo lunga"));

  const data = await new Promise((resolve) =>
    rl.question(
      "\nInserisci il giorno in cui vuoi mettere il pomodoro con la data in formato DD-MM-YYYY: ",
      resolve
    )
  );
  let oraInizio = await new Promise((resolve) =>
    rl.question("\nInserisci l'ora di inizio in formato OO:MM: ", resolve)
  );
  let oraFine = await new Promise((resolve) =>
    rl.question("\nInserisci l'ora di fine in formato OO:MM: ", resolve)
  );
  rl.close();

  let dataInizio = moment(
    `${data}T${oraInizio}`,
    "DD-MM-YYYYTHH:mm"
  ).toISOString();

  let minuti = getMinutesBetweenDates(
    dataInizio,
    moment(`${data}T${oraFine}`, "DD-MM-YYYYTHH:mm").toISOString()
  );

  let sessione = parseInt(concentrazione) + parseInt(pausa);

  while (minuti > 0) {
    if (sessione >= minuti && count % 5 == 0) {
      evento = {};
      evento.summary = `${nome + count}`;
      evento.start = {
        dateTime: dataInizio,
        timeZone: fuso,
      };
      dataInizio = moment(dataInizio)
        .add(concentrazione, "minutes")
        .toISOString();
      evento.end = {
        dateTime: dataInizio,
        timeZone: fuso,
      };
      dataInizio = moment(dataInizio).add(pausa, "minutes").toISOString();
      minuti = minuti - sessione;
      eventi.push(evento);
    } else if (sessione >= minuti && count % 5 != 0) {
      dataInizio = moment(dataInizio).add(sessione, "minutes").toISOString();
      minuti = minuti - sessione;
    } else {
      evento = {};
      evento.summary = `${nome + count}`;
      evento.start = {
        dateTime: dataInizio,
        timeZone: fuso,
      };
      dataInizio = moment(dataInizio)
        .add(concentrazione, "minutes")
        .toISOString();
      evento.end = {
        dateTime: dataInizio,
        timeZone: fuso,
      };
      dataInizio = moment(dataInizio).add(pausa, "minutes").toISOString();
      minuti = minuti - sessione;
      eventi.push(evento);
    }
    count++;
  }

  return eventi;
}

module.exports = { createPomodoro };
