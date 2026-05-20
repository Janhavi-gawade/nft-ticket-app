import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut, LogIn, User, Wallet } from "lucide-react";
import { ethers } from "ethers";

export default function Navbar() {
  const { user, logout, walletSigner, setWalletSigner, loginWithWallet } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setWalletSigner(signer);
      if (!user) {
        // If not logged in, log in with wallet
        loginWithWallet(address);
      } else {
        bindWalletToUser(address);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet.");
    }
  };

  // Get display text for the user badge
  const getUserBadgeText = () => {
    if (user?.role === 'admin') return `Admin: ${user.name}`;
    if (user?.walletAddress) {
      return `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`;
    }
    return user?.name || "Customer";
  };

  return (
    <div className="nav">
      <Link to="/">
        <h2>🎟 NFTx</h2>
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        
        {user && (
          <Link to="/tickets">My Tickets</Link>
        )}
        
        {user?.role === "admin" && (
          <Link to="/admin">Admin Panel</Link>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="user-profile">
            <span className="user-tag">
              <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {getUserBadgeText()}
            </span>

            {!walletSigner && (
              <button className="primary-btn" onClick={handleConnectWallet} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Wallet size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Connect Wallet
              </button>
            )}

            {walletSigner && (
              <span className="user-tag" style={{ border: '1px solid var(--success)', color: 'var(--success)' }}>
                {walletSigner.address ? `${walletSigner.address.slice(0,6)}...${walletSigner.address.slice(-4)}` : 'Connected'}
              </span>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="primary-btn" onClick={handleConnectWallet} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wallet size={16} />
              Connect
            </button>
            <Link to="/login">
              <button className="primary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogIn size={16} />
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}