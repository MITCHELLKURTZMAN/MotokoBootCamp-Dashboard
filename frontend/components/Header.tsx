import React from "react"
import logo from "../assets/motokobootcamp.png"
import { ConnectButton, ConnectDialog } from "@connect2ic/react"
import "@connect2ic/core/style.css"

const Header: React.FC = () => {
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
        <ConnectButton />
      </div>
      <ConnectDialog />
    </header>
  )
}

export default Header
