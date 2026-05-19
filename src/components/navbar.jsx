import { Link } from "react-router-dom";
import WalletButton from "./WalletButton";

export default function Navbar() {
  return (
    <div className="nav">
      <h2>🎟 NFTx</h2>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/tickets">My Tickets</Link>
        <Link to="/admin">Admin</Link>
      </div>
      <WalletButton />
    </div>
  );
}