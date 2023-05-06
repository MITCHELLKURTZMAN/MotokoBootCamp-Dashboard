import React from "react"
import { StudentList } from "../../types/types"
import "./_student.scss"

interface StudentItemProps {
  student: StudentList
}

const StudentItem: React.FC<StudentItemProps> = ({ student }) => {
  const renderSkeletonLoader = () => {
    return (
      <div className="Student-item">
        <div className="skeleton skeleton-name"></div>
        <div className="skeleton skeleton-rank"></div>
        <div className="skeleton skeleton-progress"></div>
        <div className="progress-bar">
          <div className="skeleton skeleton-progress-bar"></div>
        </div>
      </div>
    )
  }

  return student ? (
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
  ) : (
    renderSkeletonLoader()
  )
}

export default StudentItem
