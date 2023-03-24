const readline = require("readline");
const chalk = require("chalk");

const { createPomodoro } = require("./subfunctions/createPomodoro");
const { createEvent } = require("./subfunctions/createEvent");

let milliseconds = 10000;

/**
 * funzione che attente ms millisecondi
 * @param {Int} ms
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Funzione che aggiunge uno o più eventi al calendario dell'utente
 * @param {Calendar} calendar
 */
async function aggiuntaEvento(calendar) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  await new Promise((resolve) =>
    rl.question(
      chalk.blue(
        "Che tipologia di evento vuoi aggiungere?\n1. Evento.\n2. Pomodoro.\n"
      ),
      async function (scelta) {
        switch (scelta.trim()) {
          // creazione evento pomodoro
          case "1": {
            rl.close();
            const event = await createEvent();
            const aggiunta = calendar.events.insert({
              calendarId: "primary",
              resource: event,
            });
            console.log(chalk.green(`Creato l'evento ${event.summary}.\n`));
            break;
          }

          // creazione evento normale
          case "2": {
            rl.close();
            const eventi = await createPomodoro();
            console.log(
              chalk.green(
                `Inizio procedura di creazione eventi.\nVerrà creato un evento ogni ${
                  milliseconds / 1000
                } secondi.`
              )
            );

            //* creazione di eventi con attesa per non ricevere rate limit
            for (let index = 0; index < eventi.length; index++) {
              await calendar.events.insert({
                calendarId: "primary",
                resource: eventi[index],
              });
              console.log(
                chalk.green(`Creati ${index + 1}/${eventi.length} eventi.\n`)
              );
              await wait(milliseconds);
            }
            break;
          }

          //! scelta non valida
          default: {
            console.log(chalk.red("Scelta non valida.\n"));
            break;
          }
        }
      }
    )
  );
}

module.exports = { aggiuntaEvento };
