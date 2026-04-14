import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/movies");
  };

  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">MovieVault</span>
          </Link>
        </div>

        <div className="navbar-center">
          <form onSubmit={handleSearchSubmit} role="search">
            <label className="search-field" aria-label="Search movies">
              <span className="search-icon" aria-hidden="true">
                Find
              </span>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search movies"
              />
            </label>
          </form>
        </div>

        <div className="navbar-right">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/movies" className={navLinkClass}>
            Movies
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
