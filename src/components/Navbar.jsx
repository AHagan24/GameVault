import { Link } from "react-router-dom";

function Navbar() { 
    return (
        <nav>
            <h2>GameVault</h2>
            <div>
                <Link to="/">Home</Link>
                <Link to="/games">Games</Link>
                <Link to="/favorites">Favorites</Link>
            </div>
            </nav>
    )
}

export default Navbar;