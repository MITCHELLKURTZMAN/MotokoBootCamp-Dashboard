import React from "react"
import { Student } from "../types/types"

interface StudentItemProps {
  student: Student
}

const StudentItem: React.FC<StudentItemProps> = ({ student }) => {
  return (
    <div className="Student-item">
      <h4>{student.name}</h4>
      <p>Rank: {student.rank}</p>
      <p>
        <>Progress: {student.score}% </>
      </p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${student.score}%` }}></div>
      </div>
    </div>
  )
}

export default StudentItem
