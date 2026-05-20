import { useState, useContext } from "react";
import { ethers } from "ethers";
import { AppContext } from "../context/AppContext";

export default function WalletButton() {
  const [wallet, setWallet] = useState("");
  const { setWalletSigner } = useContext(AppContext);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWallet(address);
      setWalletSigner(signer);
      
    } catch (err) {
      console.log(err);
      alert("Connection failed");
    }
  };

  return (
    <div>
      <button className="primary-btn" onClick={connectWallet}>
        {wallet
          ? wallet.slice(0,6) + "..." + wallet.slice(-4)
          : "Connect Wallet"}
      </button>
    </div>
  );
}