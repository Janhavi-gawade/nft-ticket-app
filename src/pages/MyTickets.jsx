import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Award, ShieldAlert } from 'lucide-react';

export default function MyTickets() {
  const { userTickets, user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/tickets');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Redirecting in useEffect
  }

  return (
    <div className="page tickets-page">
      <div className="tickets-header">
        <h1>🎟 My NFT Tickets</h1>
        <p>Manage your event tickets and attendance badges</p>
      </div>

      <div className="tickets-grid">
        {userTickets.length === 0 ? (
          <p>You haven't minted any tickets yet.</p>
        ) : (
          userTickets.map(ticket => (
            <div key={ticket.id} className={`ticket-card ${ticket.isAttended ? 'badge-card' : ''}`}>
              <div className="ticket-header">
                <h3>{ticket.eventName}</h3>
                <span className="ticket-id">#{ticket.id}</span>
              </div>
              
              <div className="ticket-body">
                {ticket.isAttended ? (
                  <div className="badge-content">
                    <Award size={64} className="badge-icon" />
                    <h4>Attendance Badge</h4>
                    <p>Verified Attendee</p>
                  </div>
                ) : (
                  <div className="qr-container">
                    <QRCodeSVG 
                      value={JSON.stringify({
                        ticketId: ticket.id,
                        eventId: ticket.eventId,
                        signature: ticket.signature
                      })} 
                      size={150} 
                      level="H"
                      includeMargin={true}
                    />
                    <p className="qr-hint">Scan at the entrance</p>
                  </div>
                )}
              </div>
              
              <div className="ticket-footer">
                {ticket.isAttended ? (
                  <span className="status attended"><Award size={16}/> Minted as Badge</span>
                ) : (
                  <span className="status active"><Ticket size={16}/> Active Ticket</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}