import React from "react"
import "./_schedule.scss"

const Schedule = () => {
  return (
    <div className="schedule">
      <h2>Our Schedule</h2>
      <iframe
        className="calendar-iframe"
        src="https://calendar.google.com/calendar/embed?src=e0a9c944a17afc070ed77f9f10688eaac557ebd0251c5e6d0b724253506d43b3%40group.calendar.google.com&ctz=America%2FNew_York"
        width="800"
        height="600"
        scrolling="no"
        title="Google Calendar"
      ></iframe>
    </div>
  )
}

export default Schedule
