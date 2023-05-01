import React, { useState } from "react"

import "./_registration.scss"
import { useAuthStore } from "../../store/authstore"
import { useUserStore } from "../../store/userStore"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"

interface Props {
  //onRegister: (username: string) => void;
}

const Registration: React.FC<Props> = ({}) => {
  const [username, setUsername] = useState("")
  const [team, setTeam] = useState("")
  const [cliPrincipal, setCliPrincipal] = useState("")
  const teams = [
    { value: "team 1", label: "Team 1" },
    { value: "team 2", label: "Team 2" },
    // ... other teams
  ]

  const login = useAuthStore((state) => state.login)
  const [unregistered, getUser, registerUser] = useUserStore((state) => [
    state.registered,
    state.getUser,
    state.registerUser,
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // getUser(useAuthStore.getState().principal);

    registerUser(username, team, cliPrincipal)
    console.log(
      "username: ",
      username,
      "team: ",
      team,
      "cliPrincipal: ",
      cliPrincipal,
    )
  }

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <label htmlFor="principal-id" className="form-label">
          Handle
        </label>
        <input
          className="registration-input"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="team" className="form-label">
          Choose your team
        </label>
        <select
          id="team"
          name="team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="">Select your team (assigned in Discord)</option>
          {teams.map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>

        <div className="principal-id-container">
          <div className="principal-id-wrapper">
            <div className="label-with-tooltip">
              <label htmlFor="principal-id" className="form-label">
                Principal ID
              </label>
              <Tippy
                className="tippy-box"
                content={
                  <>
                    <strong>How to obtain your Principal ID:</strong>
                    <br />
                    1. Open your development environment's terminal.
                    <br />
                    2. Run the following command:
                    <br />
                    <code>dfx identity get-principal</code>
                    <br />
                    3. Copy the output and paste it into the Principal ID input
                    field.
                  </>
                }
                interactive={true}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="question-mark-tooltip"
                />
              </Tippy>
            </div>

            <input
              id="principal-id"
              type="text"
              placeholder="Command line principal ID"
              className="principalId-field"
              value={cliPrincipal}
              onChange={(e) => setCliPrincipal(e.target.value)}
              required
            />
          </div>
        </div>

        <button className="btn registration-submit" type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default Registration
