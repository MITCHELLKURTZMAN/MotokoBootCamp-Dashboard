import React, { useState, useEffect } from "react"
import { Team } from "../../types/types"
import StudentItem from "../Student/StudentItem"
import { getStudent } from "../../services/actorService"
import { Student } from "../../types/types"
import { useAuthStore } from "../../store/authstore"
import "./_team.scss"

interface TeamItemProps {
  team: Team
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const [isActive, setIsActive] = useState(false)
  const [students, setStudents] = useState<Student[]>([])

  const { user } = useAuthStore()

  useEffect(() => {
    const fetchStudents = async () => {
      const fetchedStudents = await Promise.all(
        team.teamMembers.map(async (principalId) => {
          const student = await getStudent(principalId)

          return student
        }),
      )

      setStudents(fetchedStudents)
    }

    fetchStudents()
  }, [team.teamMembers])

  const handleToggle = (event) => {
    event.stopPropagation()
    setIsActive(!isActive)
  }

  return (
    <div
      className={`team-item ${isActive ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div className="team-item-header">
        <h3>{team.teamId}</h3>
        <span className={`toggle-arrow ${isActive ? "rotated" : ""}`}>▼</span>
      </div>

      <p>
        {" "}
        <>Score: {team.score} </>
      </p>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${team.score}%` }}></div>
      </div>
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
              {students.map((student) => (
                <StudentItem key={student.principalId} student={student} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamItem
