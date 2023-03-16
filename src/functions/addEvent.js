function aggiuntaEvento(calendar, idCalendario, evento) {
  const event = {
    summary: "Google I/O 2015",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2023-03-16T12:00:00+01:00",
      timeZone: "Europe/Rome",
    },
    end: {
      dateTime: "2023-03-16T12:00:00+01:00",
      timeZone: "Europe/Rome",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
    attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  if (!evento) evento = event;

  const aggiunta = calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });
}

module.exports = { aggiuntaEvento };
