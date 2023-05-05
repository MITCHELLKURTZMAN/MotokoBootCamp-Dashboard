import React from "react"
import { StudentList } from "../../types/types"
import "./_student.scss"

interface StudentItemProps {
  student: StudentList
}

const StudentItem: React.FC<StudentItemProps> = ({ student }) => {
  return (
    <div className="Student-item">
      <h4>{student.name}</h4>
      <p>Rank: {student.rank}</p>
      <p>
        <>Progress: {student.score.toString()}% </>
      </p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${student.score}%` }}></div>
      </div>
    </div>
  )
}

export default StudentItem
