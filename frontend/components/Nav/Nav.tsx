import React from "react"
import { Link } from "react-router-dom"
import "./_nav.scss"

const Nav: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/submit" className="nav-link">
            Submit Code
          </Link>
        </li>
        <li>
          <Link to="/schedule" className="nav-link">
            Schedule
          </Link>
        </li>
        <li>
          <Link to="/resources" className="nav-link">
            Resources
          </Link>
        </li>
        <li>
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
