import React from "react"
import TeamItem from "./TeamItem"
import { Team } from "../../types/types"
import "./_team.scss"

interface TeamListProps {
  teams: Team[]
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  return (
    <section>
      <h2>Teams</h2>
      {teams.map((team) => (
        <TeamItem key={team.teamId} team={team} />
      ))}
    </section>
  )
}

export default TeamList
