import React, { useState, useEffect } from "react"
import { TeamString } from "../../types/types"

import StudentList from "../Student/StudentList"
import { Student } from "../../types/types"
import "./_team.scss"

interface TeamItemProps {
  team: TeamString
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const [isActive, setIsActive] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<TeamString[]>()

  const handleToggle = (event) => {
    event.stopPropagation()
    setIsActive(!isActive)
  }

  useEffect(() => {
    if (team !== undefined) {
      setLoading(false)
    }
  }, [teams])

  return (
    <div
      className={`team-item ${isActive ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div className="team-item-header">
        <h3>{team.name}</h3>
        <span className={`toggle-arrow ${isActive ? "rotated" : ""}`}>▼</span>
      </div>

      {loading ? (
        <div className="skeleton skeleton-score"></div>
      ) : (
        <p>
          {" "}
          <>Score: {team.score.toString()} </>
        </p>
      )}

      {loading ? (
        <div className="skeleton skeleton-progress-bar"></div>
      ) : (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${team.score}%` }}></div>
        </div>
      )}
      <div
        className={`menu-overlay ${isActive ? "menu-overlay-open" : ""}`}
        onClick={handleToggle}
      >
        <div className="menu-container">
          <button className="close-button" onClick={handleToggle}>
            &times;
          </button>
          <div className="Student-list-container">
            <div className="Student-list">
              <StudentList teamName={team.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamItem
