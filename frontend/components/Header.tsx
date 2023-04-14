import React from "react"
import logo from "../assets/motokobootcamp.png"

const Header: React.FC = () => {
  return (
    <header>
      <div className="header-content">
        <a href="/">
          <img src={logo} alt="Motoko Bootcamp" className="logo" />
        </a>
      </div>
    </header>
  )
}

export default Header
