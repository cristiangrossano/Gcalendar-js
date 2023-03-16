const { createEvent } = require("./createEvent");

async function aggiuntaEvento(calendar, idCalendario, evento) {
  const event = await createEvent();

  const aggiunta = calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });
}

module.exports = { aggiuntaEvento };
