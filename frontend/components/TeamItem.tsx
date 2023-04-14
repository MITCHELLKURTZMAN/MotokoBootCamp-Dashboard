import React from "react"

interface Team {
  id: number
  name: string
  mission: string
  progress: number
}

interface TeamItemProps {
  team: Team
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  return (
    <div className="team-item">
      <h3>{team.name}</h3>
      <p>Current Mission: {team.mission}</p>
      <p>Progress: {team.progress}%</p>
    </div>
  )
}

export default TeamItem
