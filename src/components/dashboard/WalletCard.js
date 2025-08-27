import React from "react";
import { FiDollarSign } from "react-icons/fi";

const WalletCard = () => {
  return (
    <div className="card bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
      <FiDollarSign size={30} className="text-purple-600" />
      <div>
        <h2 className="text-sm text-gray-500">Wallet Balance</h2>
        <p className="text-xl font-bold">$5,420.00</p>
      </div>
    </div>
  );
};

export default WalletCard;
