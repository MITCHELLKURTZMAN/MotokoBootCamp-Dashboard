import React, { useEffect, useState } from "react"
import "./_admin.scss"
import Heatmap from "../Charts/Heatmap"
import BarChart from "../Charts/BarChart"
import { useAdminDataStore } from "../../store/adminDataStore"
import { getVerifierActor } from "../../services/actorService"

import HelpTicketFeed from "./HelpTicketFeed"

const Admin: React.FC = () => {
  const [teamName, setTeamName] = useState("")
  const [day, setDay] = useState("")
  const [studentPrincipalId, setStudentPrincipalId] = useState("")

  const adminManuallyVerifyStudentDay = useAdminDataStore(
    (state) => state.adminManuallyVerifyStudentDay,
  )
  const getTotalCompletedPerDay = useAdminDataStore(
    (state) => state.getTotalCompletedPerDay,
  )
  const totalCompletedPerDay = useAdminDataStore(
    (state) => state.totalCompletedPerDay,
  )

  const handleTeamCreation = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team creation logic
    console.log("Team created:", teamName)
    setTeamName("")
    adminCreateTeam(teamName)
  }

  const handleProjectVerification = (e: React.FormEvent) => {
    e.preventDefault()
    adminManuallyVerifyStudentDay(day, studentPrincipalId)
  }

  const handleAdminRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    useAdminDataStore.getState().registerAdmin(e.target[0].value)
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

  useEffect(() => {
    getTotalCompletedPerDay()
  }, [])

  return (
    <>
      <div className="admin-container">
        <h1>Admin Gateway</h1>
        <div className="card double-width">
          <BarChart
            totalUsers={parseInt(totalStudents)}
            totalTeams={parseInt(totalTeams)}
            totalProjectsCompleted={parseInt(totalProjectsCompleted)}
          />
        </div>
        {/* <div className="card double-width"><Heatmap /></div> */}
        <div className="card stats">
          <h2>App Statistics</h2>
          <p>Total Users: {totalStudents}</p>
          <p>Total Teams: {totalTeams}</p>
          <p>Total Projects Completed: {totalProjectsCompleted}</p>

          <p style={{ borderBottom: "1px solid grey" }}>
            Total Students Completed Per Day
          </p>

          {Object.entries(totalCompletedPerDay).map(([day, count]) => (
            <p key={day}>
              Day {day.substring(3)}: {count}
            </p>
          ))}
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
            <div className="admin-input-container">
              <label htmlFor="day" className="admin-input-label"></label>
              <select
                className="admin-input"
                id="day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="1">Day 1</option>
                <option value="2">Day 2</option>
                <option value="3">Day 3</option>
                <option value="4">Day 4</option>
                <option value="5">Day 5</option>
              </select>
            </div>
            <div className="admin-input-container">
              <label
                htmlFor="student-principal-id"
                className="admin-input-label"
              ></label>
              <input
                className="admin-input"
                id="student-principal-id"
                type="text"
                placeholder="Student Principal ID"
                value={studentPrincipalId}
                onChange={(e) => setStudentPrincipalId(e.target.value)}
              />
            </div>
            <button className="admin-submit" type="submit">
              Verify
            </button>
          </form>
        </div>
        <div className="card register-admin">
          <h2>Register New Admin</h2>
          <form onSubmit={handleAdminRegistration}>
            <input
              className="admin-input"
              type="text"
              placeholder="Principal ID"
            />
            <button className="admin-submit" type="submit">
              Register Admin
            </button>
          </form>
        </div>
      </div>
      <div className="card double width">
        <HelpTicketFeed />
      </div>
    </>
  )
}

export default Admin
