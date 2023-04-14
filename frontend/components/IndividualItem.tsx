import React from "react"

interface Individual {
  id: number
  name: string
  rank: string
  progress: number
}

interface IndividualItemProps {
  individual: Individual
}

const IndividualItem: React.FC<IndividualItemProps> = ({ individual }) => {
  return (
    <div className="individual-item">
      <h3>{individual.name}</h3>
      <p>Rank: {individual.rank}</p>
      <p>Progress: {individual.progress}%</p>
    </div>
  )
}

export default IndividualItem
