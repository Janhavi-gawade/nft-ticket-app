import { Link } from "react-router-dom";
import "./Navbar.css";
import WalletButton from "./WalletButton";

export default function Navbar() {

  return (

    <div className="nav">

      <h2>🎟 NFT Ticketing</h2>

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