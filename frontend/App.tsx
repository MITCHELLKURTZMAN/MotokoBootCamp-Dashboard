import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./index.scss"

const Header = lazy(() => import("./components/Header"))
const Nav = lazy(() => import("./components/Nav"))
const TeamList = lazy(() => import("./components/TeamList"))
const ActivityList = lazy(() => import("./components/ActivityList"))
const Footer = lazy(() => import("./components/Footer"))

import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
import { client } from "./context/GlobalStateContext"

import * as Verifier from "../src/declarations/Verifier"
import { GlobalStateProvider } from "./context/GlobalStateContext"
import LoadingScreen from "./components/LoadingScreen"
import Submit from "./components/Submit"

// Dummy data for testing purposes
const teams = [
  {
    id: 1,
    name: "Team Alpha",
    mission: "Basic training day 1",
    progress: 75,
    score: 150,
    individuals: [
      { id: 1, name: "John Smith", rank: "Captain", progress: 80 },
      { id: 2, name: "Jane Doe", rank: "Lieutenant", progress: 60 },
      { id: 3, name: "Mike Johnson", rank: "Private", progress: 50 },
      { id: 4, name: "Sarah Brown", rank: "Sergeant", progress: 70 },
      { id: 5, name: "Tom Davis", rank: "Corporal", progress: 55 },
    ],
  },
  {
    id: 2,
    name: "Team Bravo",
    mission: "Secure the Database",
    progress: 40,
    score: 100,
    individuals: [
      { id: 6, name: "Mary Smith", rank: "Major", progress: 90 },
      { id: 7, name: "Brian Doe", rank: "Lieutenant", progress: 65 },
      { id: 8, name: "Linda Johnson", rank: "Private", progress: 45 },
      { id: 9, name: "Steven Brown", rank: "Sergeant", progress: 75 },
      { id: 10, name: "Jennifer Davis", rank: "Corporal", progress: 60 },
    ],
  },
]

const activities = [
  {
    id: 1,
    description: 'John Smith completed the mission "Basic training day 1"',
  },
  { id: 2, description: "Jane Doe has been promoted to Lieutenant" },
  {
    id: 3,
    description: "Team Bravo has achieved a new high score",
    specialAnnouncement: true,
  },
  {
    id: 4,
    description:
      "Samantha Brown received a medal for her outstanding performance",
  },
  { id: 5, description: "Team Alpha successfully completed their operation" },
  {
    id: 6,
    description:
      "Carlos Davis led the team during a challenging field exercise",
  },
  {
    id: 7,
    description: "Rebecca Martin has been appointed as the new team leader",
  },
  {
    id: 8,
    description: "David Thompson achieved top marks in marksmanship training",
  },
  {
    id: 9,
    description: "Team Alpha has achieved a new high score",
    specialAnnouncement: true,
  },
]

function App() {
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

export default () => (
  <GlobalStateProvider>
    <Connect2ICProvider client={client}>
      <App />
    </Connect2ICProvider>
  </GlobalStateProvider>
)
