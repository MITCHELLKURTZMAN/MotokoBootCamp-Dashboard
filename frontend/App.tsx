import React from "react"
import "./index.scss"
import Header from "./components/Header"
import Nav from "./components/Nav"
import TeamList from "./components/TeamList"
import IndividualList from "./components/IndividualList"
import ActivityList from "./components/ActivityList"
import Footer from "./components/Footer"

// Dummy data for testing purposes
const teams = [
  {
    id: 1,
    name: "Team Alpha",
    mission: "Infiltrate the Network",
    progress: 75,
  },
  { id: 2, name: "Team Bravo", mission: "Secure the Database", progress: 40 },
]

const individuals = [
  { id: 1, name: "John Smith", rank: "Captain", progress: 80 },
  { id: 2, name: "Jane Doe", rank: "Lieutenant", progress: 60 },
]

const activities = [
  {
    id: 1,
    description: 'John Smith completed the mission "Infiltrate the Network"',
  },
  { id: 2, description: "Jane Doe has been promoted to Lieutenant" },
]

function App() {
  return (
    <div className="App">
      <Header />
      <Nav />
      <main>
        <TeamList teams={teams} />
        <IndividualList individuals={individuals} />
        <ActivityList activities={activities} />
      </main>
      <Footer />
    </div>
  )
}

export default App
