import React, { useState } from "react"
import "./_admin.scss"
import Heatmap from "../../Heatmap/Heatmap"

const Admin: React.FC = () => {
  const [teamName, setTeamName] = useState("")
  const [projectId, setProjectId] = useState("")

  const handleTeamCreation = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team creation logic
    console.log("Team created:", teamName)
    setTeamName("")
  }

  const handleProjectVerification = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle project verification logic
    console.log("Project verified:", projectId)
    setProjectId("")
  }

  return (
    <div className="admin-container">
      <h1>Admin Gateway</h1>
      <Heatmap />
      <div className="admin-form">
        <div className="stats">
          <h2>App Statistics</h2>
          <p>Total Users: 1000</p>
          <p>Total Teams: 250</p>
          <p>Total Projects: 500</p>
        </div>
        <div className="team-creation">
          <h2>Create Team</h2>
          <form onSubmit={handleTeamCreation}>
            <input
              className="admin-input"
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button className="admin-submit" type="submit">
              Create Team
            </button>
          </form>
        </div>
        <div className="project-verification">
          <h2>Verify Project</h2>
          <form onSubmit={handleProjectVerification}>
            <input
              className="admin-input"
              type="text"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <button className="admin-submit" type="submit">
              Verify Project
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Admin
