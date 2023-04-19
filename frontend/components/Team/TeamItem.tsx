import React, { useState, useEffect } from "react"
import { Team } from "../../types/types"
import StudentItem from "../Student/StudentItem"
import { getStudent } from "../../services/actorService"
import { Student } from "../../types/types"
import { useAuthStore } from "../../store/authstore"
import "./_team.scss"
import { useUserStore } from "../../store/userStore"
import LoadingScreen from "../Loading/LoadingScreen"
import Loader from "../Loading/Loader"

interface TeamItemProps {
  team: Team
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const [isActive, setIsActive] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuthStore()

  const student = useUserStore((state) => state.user)

  useEffect(() => {
    console.log("team", team)
    const fetchStudents = async () => {
      const fetchedStudents = await Promise.all(
        team.teamMembers.map(async (studentId) => {
          if (studentId.length < 4) return null
          return await getStudent(studentId)
        }),
      )

      setStudents(fetchedStudents.filter((student) => student !== null))
      setLoading(false)
    }

    fetchStudents()
  }, [team])

  const handleToggle = (event) => {
    event.stopPropagation()
    setIsActive(!isActive)
  }

  if (loading) {
    return <LoadingScreen />
  }

  var key = 0
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
