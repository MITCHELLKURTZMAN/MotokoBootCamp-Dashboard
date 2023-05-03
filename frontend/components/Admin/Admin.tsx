import React, { useEffect, useState } from "react"
import "./_admin.scss"
import Heatmap from "../Charts/Heatmap"
import BarChart from "../Charts/BarChart"
import { useAdminDataStore } from "../../store/adminDataStore"
import { getVerifierActor } from "../../services/actorService"

const Admin: React.FC = () => {
  const [teamName, setTeamName] = useState("")
  const [projectId, setProjectId] = useState("")

  const handleTeamCreation = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team creation logic
    console.log("Team created:", teamName)
    setTeamName("")
    adminCreateTeam(teamName)
  }

  const handleProjectVerification = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle project verification logic
    console.log("Project verified:", projectId)
    setProjectId("")
  }

  const totalStudents = useAdminDataStore((state) => state.totalStudents)
  const totalTeams = useAdminDataStore((state) => state.totalTeams)
  const totalProjectsCompleted = useAdminDataStore(
    (state) => state.totalProjectsCompleted,
  )
  const adminCreateTeam = useAdminDataStore((state) => state.adminCreateTeam)

  useEffect(() => {
    useAdminDataStore.getState().getTotalStudents()
  }, [])

  useEffect(() => {
    useAdminDataStore.getState().getTotalTeams()
  }, [])

  useEffect(() => {
    useAdminDataStore.getState().getTotalProjectsCompleted()
  }, [])

  return (
    <div className="admin-container">
      <h1>Admin Gateway</h1>
      <div className="card double-width">
        <BarChart
          totalUsers={parseInt(totalStudents)}
          totalTeams={parseInt(totalTeams)}
          totalProjectsCompleted={parseInt(totalProjectsCompleted)}
        />
      </div>
      <div className="card double-width">
        <Heatmap />
      </div>
      <div className="card stats">
        <h2>App Statistics</h2>
        <p>Total Users: {totalStudents}</p>
        <p>Total Teams: {totalTeams}</p>
        <p>Total Projects Completed: {totalProjectsCompleted}</p>
      </div>
      <div className="card team-creation">
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
      <div className="card project-verification">
        <h2>Manual Project Verification</h2>
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
  )
}

export default Admin
