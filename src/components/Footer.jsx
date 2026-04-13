import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <span className="site-footer-title">GameVault</span>
        <p className="site-footer-tech">Built with React, Vite, and RAWG API</p>
      </div>

      <nav className="site-footer-nav" aria-label="Footer">
        <Link to="/">Home</Link>
        <Link to="/games">Games</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
    </footer>
  );
}

export default Footer;
