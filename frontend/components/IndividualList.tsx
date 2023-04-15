import React from "react"
import { Individual } from "../types/types"
import IndividualItem from "./IndividualItem"

interface IndividualListProps {
  individuals?: Individual[]
}

const IndividualList: React.FC<IndividualListProps> = ({ individuals }) => {
  if (!individuals) {
    return null
  }

  return (
    <div className="individual-list">
      {individuals.map((individual) => (
        <IndividualItem key={individual.id} individual={individual} />
      ))}
    </div>
  )
}

export default IndividualList
