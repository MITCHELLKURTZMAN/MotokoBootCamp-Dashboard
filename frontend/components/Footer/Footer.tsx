import React from "react"
import "./_footer.scss"
import { images } from "../../constants/constants"
import logo from "../../assets/images/dfinity.svg"

const Footer: React.FC = () => {
  return (
    <footer>
      <img src={logo} alt="Footer Logo" className="footer-logo" />
    </footer>
  )
}

export default Footer
