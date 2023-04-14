import React from "react"
import IndividualItem from "./IndividualItem"

interface Individual {
  id: number
  name: string
  rank: string
  progress: number
}

interface IndividualListProps {
  individuals: Individual[]
}

const IndividualList: React.FC<IndividualListProps> = ({ individuals }) => {
  return (
    <section>
      <h2>Individuals</h2>
      {individuals.map((individual) => (
        <IndividualItem key={individual.id} individual={individual} />
      ))}
    </section>
  )
}

export default IndividualList
