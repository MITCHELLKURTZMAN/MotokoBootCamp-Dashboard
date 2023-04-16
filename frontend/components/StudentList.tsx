import React from "react"
import { Student } from "../types/types"
import StudentItem from "./StudentItem"

interface StudentListProps {
  Students?: Student[]
}

const StudentList: React.FC<StudentListProps> = ({ Students }) => {
  if (!Students) {
    return null
  }

  return (
    <div className="Student-list">
      {Students.map((Student) => (
        <StudentItem key={Student.principalId} student={Student} />
      ))}
    </div>
  )
}

export default StudentList
