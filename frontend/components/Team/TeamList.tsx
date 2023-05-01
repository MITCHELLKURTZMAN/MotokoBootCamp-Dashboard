import React from "react"
import TeamItem from "./TeamItem"
import { Team, TeamString } from "../../types/types"
import "./_team.scss"
import { useTeamStore } from "../../store/teamStore"
import { useEffect } from "react"

interface TeamListProps {
  teams: TeamString[]
}

const TeamList: React.FC<TeamListProps> = ({ teams }) => {
  return (
    <section>
      <h2>Teams</h2>
      {teams.map((team) => (
        <TeamItem key={team.name} team={team} />
      ))}
    </section>
  )
}

export default TeamList
