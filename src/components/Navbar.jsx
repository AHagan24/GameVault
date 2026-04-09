import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">GameVault</span>
          </Link>
        </div>

        <div className="navbar-center">
          <label className="search-field" aria-label="Search games">
            <input
              type="text"
              placeholder="Search games, genres, or platforms"
              className="search-input"
            />
          </label>
        </div>

        <div className="navbar-right">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/games" className={navLinkClass}>
            Games
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
