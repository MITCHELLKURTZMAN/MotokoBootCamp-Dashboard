import React from "react"
import TeamItem from "./TeamItem"

interface Team {
  id: number
  name: string
  mission: string
  progress: number
}

interface TeamListProps {
  teams: Team[]
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  return (
    <section>
      <h2>Teams</h2>
      {teams.map((team) => (
        <TeamItem key={team.id} team={team} />
      ))}
    </section>
  )
}

export default TeamList
