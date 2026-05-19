import { useState } from "react";
import { ethers } from "ethers";

export default function WalletButton() {

  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {

    try {

      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const provider =
        new ethers.BrowserProvider(window.ethereum);

      await provider.send(
        "eth_requestAccounts",
        []
      );

      const signer = await provider.getSigner();

      const address = await signer.getAddress();

      setWallet(address);

    } catch (err) {
      console.log(err);
      alert("Connection failed");
    }
  };

  return (
    <div>

      <button onClick={connectWallet}>

        {wallet
          ? wallet.slice(0,6) + "..." + wallet.slice(-4)
          : "Connect Wallet"}

      </button>

    </div>
  );
}