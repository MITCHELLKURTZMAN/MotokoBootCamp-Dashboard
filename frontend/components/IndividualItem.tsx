import React from "react"
import { Individual } from "../types/types"

interface IndividualItemProps {
  individual: Individual
}

const IndividualItem: React.FC<IndividualItemProps> = ({ individual }) => {
  return (
    <div className="individual-item">
      <h4>{individual.name}</h4>
      <p>Rank: {individual.rank}</p>
      <p>Progress: {individual.progress}%</p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${individual.progress}%` }}
        ></div>
      </div>
    </div>
  )
}

export default IndividualItem
