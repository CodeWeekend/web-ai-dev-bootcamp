// Simple navigation bar using react-router-dom
import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active" : undefined)}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        About
      </NavLink>
      <NavLink
        to="/students"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Students
      </NavLink>
      <NavLink
        to="/teachers"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Teachers
      </NavLink>
      {/* Spacer to push login/signup to the right */}
      <div style={{ flex: 1 }} />
      {/* Login and Sign Up links (do nothing for now) */}
      <a href="#" className="nav-link">
        Login
      </a>
      <a href="#" className="nav-link">
        Sign Up
      </a>
    </nav>
  );
}
