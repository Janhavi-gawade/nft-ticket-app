import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [walletSigner, setWalletSigner] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nftx_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('nftx_registered_users');
    if (saved) return JSON.parse(saved);
    return [
      { email: 'admin@nftx.com', password: 'admin123', role: 'admin', name: 'Admin Manager' },
      { email: 'customer@nftx.com', password: 'customer123', role: 'customer', name: 'John Doe' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nftx_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);
  
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('nftx_events');
    if (saved) return JSON.parse(saved);
    return [
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
    ];
  });

  const [userTickets, setUserTickets] = useState(() => {
    const saved = localStorage.getItem('nftx_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1001,
        eventId: 1,
        eventName: 'Web3 Dev Summit',
        isAttended: false,
        signature: '0xmockSignature123'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nftx_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nftx_tickets', JSON.stringify(userTickets));
  }, [userTickets]);

  const login = (email, password, role) => {
    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
    );
    if (matchedUser) {
      const loggedUser = { email: matchedUser.email, role: matchedUser.role, name: matchedUser.name };
      setUser(loggedUser);
      localStorage.setItem('nftx_user', JSON.stringify(loggedUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email, password, or role' };
  };

  const registerUser = (name, email, password, role) => {
    const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { name, email, password, role };
    setRegisteredUsers([...registeredUsers, newUser]);
    
    // Automatically log in the newly registered user
    const loggedUser = { email: newUser.email, role: newUser.role, name: newUser.name };
    setUser(loggedUser);
    localStorage.setItem('nftx_user', JSON.stringify(loggedUser));
    return { success: true };
  };

  const loginWithWallet = (address) => {
    const loggedUser = { email: '', role: 'customer', name: 'Web3 Customer', walletAddress: address };
    setUser(loggedUser);
    localStorage.setItem('nftx_user', JSON.stringify(loggedUser));
  };

  const bindWalletToUser = (address) => {
    if (user) {
      const updatedUser = { ...user, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem('nftx_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setWalletSigner(null);
    localStorage.removeItem('nftx_user');
  };

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
    <AppContext.Provider value={{ 
      events, 
      userTickets, 
      walletSigner, 
      setWalletSigner, 
      user, 
      login, 
      registerUser,
      loginWithWallet, 
      bindWalletToUser,
      logout, 
      addEvent, 
      mintTicket, 
      markAttendance 
    }}>
      {children}
    </AppContext.Provider>
  );
};

