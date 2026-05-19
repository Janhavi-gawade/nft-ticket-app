import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [walletSigner, setWalletSigner] = useState(null);
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Web3 Dev Summit',
      date: '25 June 2026',
      location: 'Online',
      category: 'Workshop',
      limit: 100,
      sold: 1,
      attendance: 0,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
    }
  ]);

  const [userTickets, setUserTickets] = useState([
    {
      id: 1001,
      eventId: 1,
      eventName: 'Web3 Dev Summit',
      isAttended: false,
      signature: '0xmockSignature123'
    }
  ]);

  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now(), sold: 0, attendance: 0 }]);
  };

  const mintTicket = (eventId, eventName, signature) => {
    const newTicket = {
      id: Date.now(),
      eventId,
      eventName,
      isAttended: false,
      signature
    };
    setUserTickets([...userTickets, newTicket]);
    
    // Update sold count for the event
    setEvents(events.map(ev => ev.id === eventId ? { ...ev, sold: ev.sold + 1 } : ev));
  };

  const markAttendance = (ticketId) => {
    // Update ticket status
    let updatedEventId = null;
    setUserTickets(userTickets.map(t => {
      if (t.id === ticketId && !t.isAttended) {
        updatedEventId = t.eventId;
        return { ...t, isAttended: true };
      }
      return t;
    }));

    // Update event attendance count
    if (updatedEventId) {
      setEvents(events.map(ev => ev.id === updatedEventId ? { ...ev, attendance: ev.attendance + 1 } : ev));
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{ events, userTickets, walletSigner, setWalletSigner, addEvent, mintTicket, markAttendance }}>
      {children}
    </AppContext.Provider>
  );
};
