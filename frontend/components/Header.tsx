import React, { useEffect } from "react"
import logo from "../assets/motokobootcamp.png"
import { useAuthStore } from "../store/authstore"

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <header>
      <div className="header-content">
        <a href="/">
          <img src={logo} alt="Motoko Bootcamp" className="logo" />
        </a>
      </div>
      <div
        className="auth-section"
        style={{
          filter: "drop-shadow(1px 5px 1px black)",
        }}
      >
        {isAuthenticated ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </header>
  )
}

export default Header
