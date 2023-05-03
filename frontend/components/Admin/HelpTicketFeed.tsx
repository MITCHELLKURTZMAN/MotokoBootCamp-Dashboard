import React, { useEffect } from "react"
import "./_helpTicketFeed.scss"
import { useAdminDataStore } from "../../store/adminDataStore"

const HelpTicketFeed: React.FC = () => {
  const helpTickets = useAdminDataStore((state) => state.helpTickets)
  const getHelpTickets = useAdminDataStore((state) => state.getHelpTickets)
  const resolveHelpTicket = useAdminDataStore(
    (state) => state.resolveHelpTicket,
  )

  useEffect(() => {
    getHelpTickets()
  }, [])

  const renderHelpTicket = (ticket) => {
    return (
      <li key={ticket.helpTicketId}>
        <div className="help-ticket-feed__list-item-label">Principal ID:</div>
        <div className="help-ticket-feed__list-item-value">
          {ticket.principalId}
        </div>
        <div className="help-ticket-feed__list-item-label">Description:</div>
        <div className="help-ticket-feed__list-item-value">
          {ticket.description}
        </div>
        <div className="help-ticket-feed__list-item-label">GitHub URL:</div>
        <div className="help-ticket-feed__list-item-value">
          {ticket.gitHubUrl}
        </div>
        <div className="help-ticket-feed__list-item-label">Day:</div>
        <div className="help-ticket-feed__list-item-value">{ticket.day}</div>
        <div className="help-ticket-feed__list-item-label">Canister ID:</div>
        <div className="help-ticket-feed__list-item-value">
          {ticket.canisterId}
        </div>
        <div className="help-ticket-feed__list-item-actions">
          <button onClick={() => resolveHelpTicket(ticket.helpTicketId, true)}>
            Approve
          </button>
          <button onClick={() => resolveHelpTicket(ticket.helpTicketId, false)}>
            Deny
          </button>
        </div>
      </li>
    )
  }

  return (
    <div className="help-ticket-feed">
      <h2 className="help-ticket-feed__header">Help Tickets</h2>
      <ul className="help-ticket-feed__list">
        {helpTickets.map((ticket) => renderHelpTicket(ticket))}
      </ul>
    </div>
  )
}

export default HelpTicketFeed
