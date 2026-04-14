import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <span className="site-footer-title">MovieVault</span>
        <p className="site-footer-tech">Built with React, Vite, and OMDb API</p>
      </div>

      <nav className="site-footer-nav" aria-label="Footer">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
    </footer>
  );
}

export default Footer;
