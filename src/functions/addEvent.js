const { createPomodoro } = require("./createPomodoro");
const { createEvent } = require("./createEvent");
const readline = require("readline");
const { createTravel } = require("./createTravel");

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
      "Che tipologia di evento vuoi aggiungere?\n1. Pomodoro.\n2. Evento Normale.\n3. Viaggi.\n",
      async function (scelta) {
        console.log(scelta);
        rl.close();

        switch (scelta.trim()) {
          case "1":
            {
              const eventi = await createPomodoro();
              for (let index = 0; index < eventi.length; index++) {
                setTimeout(function () {
                  calendar.events.insert({
                    calendarId: "primary",
                    resource: eventi[index],
                  });
                  console.log(`Creati ${index + 1} eventi pomodoro.\n`);
                }, 5000);
              }
            }
            break;
          case "2": {
            const event = await createEvent();
            const aggiunta = calendar.events.insert({
              calendarId: "primary",
              resource: event,
            });
            console.log(`Creato l'evento ${event.summary}.\n`);
            break;
          }
          case "3":
            {
              const eventi = await createTravel(calendar);
              for (let index = 0; index < eventi.length; index++) {
                setTimeout(function () {
                  calendar.events.insert({
                    calendarId: "primary",
                    resource: eventi[index],
                  });
                  console.log(`Creati ${index + 1} viaggi.\n`);
                }, 5000);
              }
            }
            break;
          default: {
            console.log("Scelta non valida.\n");
            break;
          }
        }
      }
    )
  );
}

module.exports = { aggiuntaEvento };
