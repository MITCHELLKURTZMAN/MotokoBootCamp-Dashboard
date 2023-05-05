import React, { useEffect, useState } from "react"
import StudentItem from "./StudentItem"
import { useTeamStore } from "../../store/teamStore"
import { StudentList } from "frontend/types/types"

interface TeamProps {
  teamName: string
}

const Team: React.FC<TeamProps> = ({ teamName }) => {
  const getStudentsForTeamDashboard = useTeamStore(
    (state) => state.getStudentsForTeamDashboard,
  )

  const [students, setStudents] = useState<StudentList[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await getStudentsForTeamDashboard(teamName)
      if ("ok" in result) {
        setStudents(result.ok) // set the students to the local state
      } else {
        console.error(result.err) // handle the error case
      }
    }
    fetchStudents()
  }, [teamName, getStudentsForTeamDashboard])

  return (
    <div>
      {students.map((student: StudentList) => (
        <StudentItem student={student} />
      ))}
    </div>
  )
}

export default Team
