const readline = require("readline");
const chalk = require("chalk");

const { createPomodoro } = require("./createPomodoro");
const { createEvent } = require("./createEvent");

/**
 * Function that adds one or more events in the calendar
 * @param {Calendar} calendar
 * @param {*} idCalendario
 * @param {event} evento
 */
async function aggiuntaEvento(calendar, idCalendario, evento) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  await new Promise((resolve) =>
    rl.question(
      chalk.blue(
        "Che tipologia di evento vuoi aggiungere?\n1. Pomodoro.\n2. Evento Normale.\n"
      ),
      async function (scelta) {
        rl.close();

        switch (scelta.trim()) {
          case "1":
            {
              const eventi = await createPomodoro();
              console.log(chalk.green("Inizio procedura di creazione eventi."));
              for (let index = 0; index < eventi.length; index++) {
                setTimeout(function () {
                  calendar.events.insert({
                    calendarId: "primary",
                    resource: eventi[index],
                  });
                  console.log(
                    chalk.green(`Creati ${index + 1} eventi pomodoro.\n`)
                  );
                }, 10000);
              }
            }
            break;
          case "2": {
            const event = await createEvent();
            const aggiunta = calendar.events.insert({
              calendarId: "primary",
              resource: event,
            });
            console.log(chalk.blue(`Creato l'evento ${event.summary}.\n`));
            break;
          }

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
