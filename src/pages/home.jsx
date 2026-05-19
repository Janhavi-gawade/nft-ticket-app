import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page hero">
      <h1>Gasless NFT Ticket Platform</h1>
      <p>
        Experience the future of event ticketing. Buy, mint, and verify NFT tickets with absolutely zero gas fees using our relayer infrastructure.
      </p>
      <Link to="/events">
        <button className="primary-btn">Explore Events</button>
      </Link>
    </div>
  );
}