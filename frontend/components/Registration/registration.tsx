import React, { useState } from "react"
import "./_registration.scss"
import { useAuthStore } from "../../store/authstore"
import { useUserStore } from "../../store/userStore"

interface Props {
  //onRegister: (username: string) => void
}

const Registration: React.FC<Props> = ({}) => {
  const [username, setUsername] = useState("")

  const login = useAuthStore((state) => state.login)
  const [unregistered, getUser, registerUser] = useUserStore((state) => [
    state.registered,
    state.getUser,
    state.registerUser,
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // getUser(useAuthStore.getState().principal)

    registerUser(username)
  }

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <input
          className="registration-input"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button className="btn registration-submit" type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default Registration
