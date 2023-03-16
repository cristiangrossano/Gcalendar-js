const moment = require("moment");
const readline = require("readline");

/**
 * Function that takes in input a date and two hours, calculate the times of pomodoro cycle
 * based on the concentration time and the pause time
 */
async function createPomodoro() {
  const fuso = "Europe/Rome";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  /**
   * takes in input 2 dates and calculates the minutes between
   * @param {Date} date1
   * @param {Date} date2
   * @returns {number} the number of minutes between
   */
  function getMinutesBetweenDates(date1, date2) {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes;
  }

  const eventi = [];

  const nome = await new Promise((resolve) =>
    rl.question(
      "Inserisci nome dell'attività di cui vuoi svolgere un pomodoro: ",
      resolve
    )
  );
  const concentrazione = await new Promise((resolve) =>
    rl.question("\nInserisci durata fase di concentrazione: ", resolve)
  );
  const pausa = await new Promise((resolve) =>
    rl.question("\nInserisci durata della pausa: ", resolve)
  );
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
  //! FINE INPUT

  let dataInizio = moment(
    `${data}T${oraInizio}`,
    "DD-MM-YYYYTHH:mm"
  ).toISOString();

  let minuti = getMinutesBetweenDates(
    dataInizio,
    moment(`${data}T${oraFine}`, "DD-MM-YYYYTHH:mm").toISOString()
  );
  let evento;
  let sessione = parseInt(concentrazione) + parseInt(pausa);

  if (minuti % sessione == 0) {
    for (let index = 0; index < minuti / sessione; index++) {
      evento = {};
      evento.summary = nome;
      evento.start = {
        dateTime: dataInizio,
        timeZone: fuso,
      };

      evento.end = {};
      dataInizio = moment(dataInizio)
        .add(concentrazione, "minutes")
        .toISOString();
      evento.end = { dateTime: dataInizio, timeZone: fuso };
      dataInizio = moment(dataInizio).add(pausa, "minutes").toISOString();
      eventi.push(evento);
    }
  } else {
    // !fit
    while (minuti > sessione) {
      evento = {};
      evento.summary = nome;
      evento.start = {
        dateTime: dataInizio,
        timeZone: fuso,
      };

      dataInizio = moment(dataInizio)
        .add(concentrazione, "minutes")
        .toISOString();
      evento.end = { dateTime: dataInizio, timeZone: fuso };
      dataInizio = moment(dataInizio).add(pausa, "minutes").toISOString();
      eventi.push(evento);
      minuti = minuti - sessione;
    }

    minuti = minuti - pausa;
    evento = {};
    evento.summary = nome;
    evento.start = {
      dateTime: dataInizio,
      timeZone: fuso,
    };
    dataInizio = moment(dataInizio).add(minuti, "minutes").toISOString();
    evento.end = { dateTime: dataInizio, timeZone: fuso };
    dataInizio = moment(dataInizio).add(pausa, "minutes").toISOString();
    eventi.push(evento);
  }

  return eventi;
}

module.exports = { createPomodoro };
