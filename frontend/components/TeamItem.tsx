import React, { useState } from "react"
import { Team } from "../types/types"
import IndividualItem from "./IndividualItem"

interface TeamItemProps {
  team: Team
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const [isActive, setIsActive] = useState(false)

  const handleToggle = (event) => {
    event.stopPropagation()
    setIsActive(!isActive)
    if (!isActive) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

  return (
    <div
      className={`team-item ${isActive ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div className="team-item-header">
        <h3>{team.name}</h3>
        <span className={`toggle-arrow ${isActive ? "rotated" : ""}`}>▼</span>
      </div>
      <p>Score: {team.score}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${team.progress}%` }}></div>
      </div>
      {isActive && (
        <div
          className={`menu-overlay ${isActive ? "menu-overlay-open" : ""}`}
          onClick={handleToggle}
        >
          <div className="menu-container">
            <button className="close-button" onClick={handleToggle}>
              &times;
            </button>
            <div className="individual-list-container">
              <div className="individual-list">
                {team.individuals.map((individual) => (
                  <IndividualItem key={individual.id} individual={individual} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamItem
