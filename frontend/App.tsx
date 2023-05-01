import React, { lazy, Suspense, useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./index.scss"

const Header = lazy(() => import("./components/Header/Header"))
const Nav = lazy(() => import("./components/Nav/Nav"))
const TeamList = lazy(() => import("./components/Team/TeamList"))
const ActivityList = lazy(() => import("./components/Activity/ActivityList"))
const Footer = lazy(() => import("./components/Footer/Footer"))
import Profile from "./components/Profile/Profile"
import * as Verifier from "../src/declarations/Verifier"
import { Team, Activity, TeamString } from "./types/types"

import LoadingScreen from "./components/Loading/LoadingScreen"
import Submit from "./components/Submit/Submit"
import { useActivityStore } from "./store/activityStore"
import { useTeamStore } from "./store/teamStore"
import { useAuthStore } from "./store/authstore"
import { Toaster } from "react-hot-toast"
import { getAllTeams } from "./services/actorService"
import Registration from "./components/Registration/registration"
import Schedule from "./components/Schedule/Schedule"
import Resources from "./components/Resources/Resources"
//Dummy data for testing purposes
const dummyTeams: TeamString[] = [
  {
    name: "Team Alpha",
    teamMembers: ["1", "2", "3", "4", "5"],
    score: "150",
  },
  {
    name: "Team Bravo",
    teamMembers: ["6", "7", "8", "9", "10"],
    score: "200",
  },
]

// const activities: Activity[] = [
//   {
//     activityId: "1",
//     specialAnnouncement: "",
//     activity: 'John Smith completed the mission "Basic training day 1"',
//   },
//   {
//     activityId: "2",
//     specialAnnouncement: "",
//     activity: "Jane Doe has been promoted to Lieutenant",
//   },
//   {
//     activityId: "3",
//     specialAnnouncement: "true",
//     activity: "Team Bravo has achieved a new high score",
//   },
// ]

function App() {
  const activities = useActivityStore((state) => state.activities)
  const getActivity = useActivityStore((state) => state.getActivity)
  const getAllTeams = useTeamStore((state) => state.getAllTeams)
  const teams = useTeamStore((state) => state.teams)

  const [team, setTeam] = useState<TeamString[]>(dummyTeams)

  //set teams with real data from useTeamStore

  useEffect(() => {
    // Fetch activities when the component is mounted
    getActivity()
  }, [])

  useEffect(() => {
    // Fetch teams when the component is mounted
    getAllTeams()
    if (teams === undefined) {
      getAllTeams()
    }
  }, [])

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Toaster />
          <Header />
          <Nav />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <React.Suspense fallback={<div>Loading TeamList...</div>}>
                      <TeamList teams={teams ? teams : team} />
                    </React.Suspense>
                    <ActivityList activities={activities} />
                  </>
                }
              />
              <Route path="Submit" element={<Submit />} />
              <Route path="Schedule" element={<Schedule />} />
              <Route path="Resources" element={<Resources />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="register" element={<Registration />} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </Router>
    </div>
  )
}

export default () => <App />
