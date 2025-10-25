// src/components/TransactionTable.js

import React from 'react';

const TransactionTable = ({ transactions }) => {
  
  // Helper function to format the timestamp into a readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    // Formats to "Oct 20, 2025"
    return date.toLocaleDateString("en-US", {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[#161b22] p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Latest Transactions (Daily)</h2>
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left text-gray-400">
            {/* --- NEW DATE COLUMN --- */}
            <th className="py-3 pr-3">Date</th> 
            <th className="py-3 pr-3">Description</th>
            <th className="py-3 pr-3">Type</th>
            <th className="py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              {/* Updated colSpan to 4 */}
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No transactions yet.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-800">
                {/* --- NEW DATE CELL --- */}
                <td className="py-4 pr-3 text-gray-400">{formatDate(tx.id)}</td>
                <td className="py-4 pr-3">{tx.description}</td>
                <td className="py-4 pr-3 text-gray-400">{tx.type}</td>
                
                <td className={`py-4 text-right font-medium ${
                    tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;