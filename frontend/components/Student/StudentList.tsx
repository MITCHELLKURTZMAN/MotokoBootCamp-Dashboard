import React, { useEffect } from "react"
import StudentItem from "./StudentItem"
import { useTeamStore } from "../../store/teamStore"
import { StudentList } from "frontend/types/types"

interface TeamProps {
  teamName: string
}

const Team: React.FC<TeamProps> = ({ teamName }) => {
  useEffect(() => {
    useTeamStore.getState().getStudentsForTeamDashboard(teamName)
    console.log("teamName", teamName)
  }, [])

  const students = useTeamStore((state) => state.TeamsStudents) || []

  return (
    <div>
      {students.map((student: StudentList) => (
        <StudentItem student={student} />
      ))}
    </div>
  )
}

export default Team
