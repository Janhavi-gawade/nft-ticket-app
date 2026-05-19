import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { PlusCircle, QrCode, LayoutDashboard } from 'lucide-react';

export default function Admin() {
  const { events, addEvent, markAttendance } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', category: 'Workshop', limit: 100
  });
  
  const [scanId, setScanId] = useState('');

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;
    
    addEvent({
      ...formData,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60',
      limit: parseInt(formData.limit)
    });
    setFormData({ title: '', date: '', location: '', category: 'Workshop', limit: 100 });
    alert('Event Created Successfully!');
  };

  const handleScan = (e) => {
    e.preventDefault();
    const id = parseInt(scanId);
    if (!id) return;

    const success = markAttendance(id);
    if (success) {
      alert(`Attendance marked for Ticket #${id}`);
    } else {
      alert(`Invalid Ticket ID or already attended.`);
    }
    setScanId('');
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1><LayoutDashboard /> Admin Dashboard</h1>
        <p>Manage events and verify tickets</p>
      </div>

      <div className="admin-grid">
        <div className="card admin-form">
          <h2><PlusCircle size={20} /> Create New Event</h2>
          <form onSubmit={handleCreateEvent}>
            <input 
              placeholder="Event Title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <input 
              placeholder="Location" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Cricket">Cricket</option>
              <option value="Concert">Concert</option>
              <option value="Workshop">Workshop</option>
            </select>
            <input 
              type="number" 
              placeholder="Ticket Limit" 
              value={formData.limit}
              onChange={(e) => setFormData({...formData, limit: e.target.value})}
              required
            />
            <button type="submit" className="primary-btn">Create Event</button>
          </form>
        </div>

        <div className="card admin-scanner">
          <h2><QrCode size={20} /> Simulate QR Scanner</h2>
          <p>Enter Ticket ID to mark attendance manually (simulating QR scan)</p>
          <form onSubmit={handleScan} className="scan-form">
            <input 
              placeholder="Ticket ID (e.g. 1001)" 
              value={scanId}
              onChange={(e) => setScanId(e.target.value)}
            />
            <button type="submit" className="scan-btn">Scan Ticket</button>
          </form>
        </div>
      </div>

      <div className="admin-stats mt-4">
        <h2>Events Overview</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Sold</th>
                <th>Checked-in</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td>#{ev.id}</td>
                  <td>{ev.title}</td>
                  <td><span className={`badge ${ev.category.toLowerCase()}`}>{ev.category}</span></td>
                  <td>{ev.limit}</td>
                  <td>{ev.sold}</td>
                  <td>{ev.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}