/* landing.jsx */

import logo from "./assets/logo.webp";
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="center">
      <img src={logo} className="logo"/>
      <Link to="/content">Click Me</Link>
    </div>
  );
}