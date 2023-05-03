import { useUserStore } from "../../store/userStore"
import React, { useState } from "react"

interface HelpTicketProps {}

const HelpTicket: React.FC<HelpTicketProps> = ({}) => {
  const [issueDescription, setIssueDescription] = useState<string>("")
  const [githubUrl, setGithubUrl] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [canisterId, setCanisterId] = useState<string>("")

  const handleHelpTicketSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    useUserStore
      .getState()
      .studentCreateHelpTicket(
        issueDescription,
        githubUrl,
        canisterId,
        selectedDay.toString(),
      )
  }

  return (
    <div className="help-ticket">
      <h2 className="help-ticket__header">Submit Help Ticket</h2>
      <form className="help-ticket__form" onSubmit={handleHelpTicketSubmit}>
        <label htmlFor="issueDescription">Issue Description:</label>
        <textarea
          id="issueDescription"
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          maxLength={250}
          required
        />
        <label htmlFor="githubUrl">GitHub URL or Gist:</label>
        <input
          type="url"
          id="githubUrl"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          required
        />

        <label htmlFor="canisterId">Canister ID:</label>
        <input
          type="text"
          id="canisterId"
          value={canisterId}
          onChange={(e) => setCanisterId(e.target.value)}
          required
        />

        <label htmlFor="day">Day:</label>
        <select
          id="day"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value as unknown as number)}
          required
        >
          <option value="1">Day 1</option>
          <option value="2">Day 2</option>
          <option value="3">Day 3</option>
          <option value="4">Day 4</option>
          <option value="5">Day 5</option>
        </select>

        <button className="btn" type="submit">
          Submit Help Ticket
        </button>
      </form>
    </div>
  )
}

export default HelpTicket
