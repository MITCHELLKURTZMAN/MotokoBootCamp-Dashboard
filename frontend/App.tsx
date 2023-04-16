import React, { lazy, Suspense, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./index.scss"

const Header = lazy(() => import("./components/Header"))
const Nav = lazy(() => import("./components/Nav"))
const TeamList = lazy(() => import("./components/TeamList"))
const ActivityList = lazy(() => import("./components/ActivityList"))
const Footer = lazy(() => import("./components/Footer"))

import * as Verifier from "../src/declarations/Verifier"
import { Team, Activity } from "./types/types"

import LoadingScreen from "./components/LoadingScreen"
import Submit from "./components/Submit"
import { useActivityStore } from "./store/activityStore"

// Dummy data for testing purposes
const teams: Team[] = [
  {
    teamMembers: ["1", "2", "3", "4", "5"],
    score: BigInt(150),
    teamId: "1",
  },
  {
    teamMembers: ["6", "7", "8", "9", "10"],
    score: BigInt(100),
    teamId: "2",
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

  useEffect(() => {
    // Fetch activities when the component is mounted
    getActivity()
  }, [getActivity])

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Header />
          <Nav />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <TeamList teams={teams} />
                    <ActivityList activities={activities} />
                  </>
                }
              />
              <Route path="Submit" element={<Submit />} />
              <Route path="Schedule" element={<div>Schedule</div>} />
              <Route path="Resources" element={<div>Resources</div>} />
              <Route path="Admin" element={<div>Admin</div>} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </Router>
    </div>
  )
}

export default () => <App />
