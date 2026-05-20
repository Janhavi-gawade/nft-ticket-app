import { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Mail, Lock, LogIn, Wallet, ShieldAlert, Loader2, User } from 'lucide-react';
import { ethers } from 'ethers';

export default function Login() {
  const { login, registerUser, loginWithWallet, setWalletSigner } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'admin'
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      const res = registerUser(name, email, password, activeTab);
      if (res.success) {
        alert(`Account created successfully! Logged in as ${name}.`);
        navigate(redirectTo);
      } else {
        setError(res.error);
      }
    } else {
      const res = login(email, password, activeTab);
      if (res.success) {
        navigate(redirectTo);
      } else {
        setError(res.error);
      }
    }
  };

  const handleWalletLogin = async () => {
    setError('');
    setIsConnectingWallet(true);
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to use Web3 login.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletSigner(signer);
      loginWithWallet(address);
      
      navigate(redirectTo);
    } catch (err) {
      console.error(err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isSignUp ? 'Create Account' : 'Welcome to NFTx'}</h1>
          <p>{isSignUp ? `Register a new ${activeTab === 'admin' ? 'Admin' : 'Customer'} profile` : 'Sign in to manage your tickets and events'}</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`login-tab ${activeTab === 'customer' ? 'active' : ''}`}
            onClick={() => handleTabChange('customer')}
          >
            Customer
          </button>
          <button 
            className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin Portal
          </button>
        </div>

        {error && (
          <div className="error-message">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="login-form-group">
              <label htmlFor="name">Full Name</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" size={18} />
                <input 
                  id="name"
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" size={18} />
              <input 
                id="email"
                type="email" 
                placeholder={activeTab === 'admin' ? "admin@nftx.com" : "customer@nftx.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={18} />
              <input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="login-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="primary-btn full-width login-btn">
            <LogIn size={18} />
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {!isSignUp && activeTab === 'customer' && (
          <>
            <div className="divider">or connect via</div>
            
            <button 
              type="button" 
              className="wallet-login-btn"
              onClick={handleWalletLogin}
              disabled={isConnectingWallet}
            >
              {isConnectingWallet ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Connecting wallet...
                </>
              ) : (
                <>
                  <Wallet size={18} />
                  Sign In with Web3 Wallet
                </>
              )}
            </button>
          </>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 600, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 600, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        {!isSignUp && (
          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <p>
              Demo Credentials:<br />
              <strong>{activeTab === 'admin' ? 'admin@nftx.com / admin123' : 'customer@nftx.com / customer123'}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
