import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function Events() {
  const { events } = useContext(AppContext);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Hackathon', 'Cricket', 'Concert', 'Workshop'];

  const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <div className="page events-page">
      <div className="events-header">
        <h1>🔥 Upcoming Events</h1>
        <div className="filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <p>No events found for this category.</p>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-img" style={{ backgroundImage: `url(${event.image})` }}>
                <span className={`badge ${event.category.toLowerCase()}`}>{event.category}</span>
              </div>
              <div className="event-content">
                <h2>{event.title}</h2>
                <div className="event-meta">
                  <span><Calendar size={16} /> {event.date}</span>
                  <span><MapPin size={16} /> {event.location}</span>
                  <span><Users size={16} /> {event.sold} / {event.limit} Sold</span>
                </div>
                <Link to={`/event?id=${event.id}`}>
                  <button className="primary-btn full-width">View Event & Mint Ticket</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}