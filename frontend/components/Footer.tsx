import React from "react"
import footerLogo from "../assets/Motoko.png"
import dfinity from "../assets/dfinity.svg"

const Footer: React.FC = () => {
  return (
    <footer>
      <img src={dfinity} alt="Footer Logo" className="footer-logo" />
    </footer>
  )
}

export default Footer
