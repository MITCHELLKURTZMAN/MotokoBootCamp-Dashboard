import React from "react"
import { Link } from "react-router-dom"
import "./_nav.scss"
import { useAuthStore } from "../../store/authstore"

const Nav: React.FC = () => {
  //todo hide profile if logged in (currently not worth a bug if it doesn't work)
  const loggedIn = useAuthStore((state) => state.isLoggedin)

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
        {/* <li>
          <Link to="/schedule" className="nav-link">
            Schedule
          </Link>
        </li> */}
        {/* <li>
          <Link to="/resources" className="nav-link">
            Resources
          </Link>
        </li> */}

        <li>
          <Link to="/Profile" className="nav-link">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
