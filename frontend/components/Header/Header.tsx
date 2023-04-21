import React, { useEffect } from "react"

import { images } from "../../constants/constants"
import logo from "../../assets/images/motokobootcamp.png"
import { useAuthStore } from "../../store/authstore"
import "./_header.scss"
import { Principal } from "@dfinity/candid/lib/cjs/idl"
import { useUserStore } from "../../store/userStore"

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoggedin = useAuthStore((state) => state.isLoggedin)
  const unregistered = useUserStore((state) => state.unregistered)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const init = useAuthStore((state) => state.init)

  // useEffect(() => {
  //   init()
  // }, [init])

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
        {isLoggedin ? (
          <button className="btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="btn" onClick={login}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
