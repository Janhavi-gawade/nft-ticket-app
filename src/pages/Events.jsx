import { Link } from "react-router-dom";

export default function Events() {
  return (
    <div className="page">

      <h1>🔥 Upcoming Events</h1>

      <div className="card">

        <h2>Web3 Dev Summit</h2>

        <p>25 June 2026</p>

        <Link to="/event">
          <button>View Event</button>
        </Link>

      </div>

    </div>
  );
}