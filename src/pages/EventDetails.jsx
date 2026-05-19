import { getContract } from "../blockchain";

export default function EventDetails() {

  const mintTicket = async () => {

    try {

      const contract =
        await getContract();

      const tx =
        await contract.mint();

      await tx.wait();

      alert(
        "🎉 NFT Ticket Minted Successfully!"
      );

    } catch (err) {

      console.log(err);

      alert("Mint failed");
    }
  };

  return (

    <div className="page">

      <h1>🎫 Web3 Dev Summit</h1>

      <p>Date: 25 June 2026</p>

      <p>Location: Online</p>

      <p>
        Entry requires NFT ticket
      </p>

      <button onClick={mintTicket}>

        🎟 Mint NFT Ticket

      </button>

    </div>
  );
}