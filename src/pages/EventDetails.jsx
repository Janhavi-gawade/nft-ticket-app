import { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Ticket, Loader2 } from 'lucide-react';
import { useUGFModal } from '@tychilabs/react-ugf';

export default function EventDetails() {
  const [searchParams] = useSearchParams();
  const eventId = parseInt(searchParams.get('id'));
  const navigate = useNavigate();
  
  const { events, mintTicket, walletSigner } = useContext(AppContext);
  const event = events.find(e => e.id === eventId);
  
  const [isMinting, setIsMinting] = useState(false);

  const { openUGF } = useUGFModal();

  const handleGaslessMint = async () => {
    try {
      if (!walletSigner) {
        alert("Please connect your wallet first!");
        return;
      }
      
      setIsMinting(true);
      
      const userAddress = await walletSigner.getAddress();
      
      // Use UGF to perform a remote transaction on Base Sepolia
      // We send a mock transaction to the user's own address as a demonstration
      // In a real scenario, this would be the destination Smart Contract address.
      await openUGF({
        signer: walletSigner,
        tx: {
          to: userAddress,
          data: "0x00", // Dummy data
          value: 0n,
        },
        destChainId: "84532", // Base Sepolia
      });

      // Once UGF executes the transaction successfully, update frontend state
      const mockSignature = "0x" + Math.random().toString(16).slice(2);
      mintTicket(event.id, event.title, mockSignature);
      
      alert("🎉 NFT Ticket Minted Successfully on Base Sepolia!");
      navigate('/tickets');
      
    } catch (err) {
      console.log(err);
      alert("Mint failed: " + err.message);
    } finally {
      setIsMinting(false);
    }
  };

  if (!event) return <div className="page"><h2>Event not found</h2></div>;

  return (
    <div className="page event-details-page">
      <div className="event-hero" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="hero-overlay">
          <h1>{event.title}</h1>
          <p>{event.date} | {event.location}</p>
        </div>
      </div>
      
      <div className="event-info-card card">
        <div className="info-row">
          <span className="label">Category:</span>
          <span className={`badge ${event.category.toLowerCase()}`}>{event.category}</span>
        </div>
        <div className="info-row">
          <span className="label">Availability:</span>
          <span>{event.limit - event.sold} tickets remaining</span>
        </div>
        <p className="description">
          Entry requires an NFT ticket. Minting is completely gasless! Just sign the message to claim your ticket.
        </p>

        <button 
          className="primary-btn gasless-btn full-width" 
          onClick={handleGaslessMint}
          disabled={isMinting || event.sold >= event.limit}
        >
          {isMinting ? <><Loader2 className="spinner" /> Minting via Relayer...</> : <><Ticket /> Mint NFT Ticket (Gasless)</>}
        </button>
      </div>
    </div>
  );
}