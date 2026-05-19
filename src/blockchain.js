import { ethers } from "ethers";

export const CONTRACT_ADDRESS =
  "0x1234abcd...";

export const ABI = [
  "function mint() public"
];

export const getContract = async () => {

  if (!window.ethereum) {
    alert("Install MetaMask");
    return null;
  }

  const provider =
    new ethers.BrowserProvider(window.ethereum);

  const signer =
    await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
};