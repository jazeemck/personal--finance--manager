// src/Pages/Dashboard.js

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ChartComponent from "../components/ChartComponent";
import TransactionTable from "../components/TransactionTable";

// Start with an empty list
const initialTransactions = [];

const Dashboard = () => {
  // --- STATE ---
  // Modal state
  const [showForm, setShowForm] = useState(false);
  
  // Form input state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('earning'); // 'earning' or 'spent'
  const [description, setDescription] = useState('');
  // Add state for the date input, default to today
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Data state
  const [transactions, setTransactions] = useState(initialTransactions);
  
  // Calculated state for cards
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // --- EFFECT ---
  // This hook recalculates totals whenever the 'transactions' list changes
  useEffect(() => {
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let totalBalance = 0;

    // Get today's date info
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Loop once to calculate all totals
    transactions.forEach(tx => {
      // 1. Calculate Total Balance (all transactions)
      totalBalance += tx.amount;

      // 2. Check if transaction is in the current month
      const txDate = new Date(tx.id);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.amount > 0) {
          monthlyIncome += tx.amount;
        } else {
          monthlyExpense += tx.amount;
        }
      }
    });
    
    // Set state for the cards
    setIncome(monthlyIncome); // Monthly Income
    setExpense(Math.abs(monthlyExpense)); // Monthly Expense
    setBalance(totalBalance); // All-Time Balance

  }, [transactions]); // Dependency array: runs this code ONLY when 'transactions' changes

  // --- FUNCTIONS ---
  // This function now adds the new data to your state using the selected date
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert selected date (e.g., "2025-10-20") to a timestamp
    // We add the current time just to make the ID more unique
    const selectedDateTimestamp = new Date(date).getTime();
    const uniqueTimestamp = selectedDateTimestamp + (Date.now() % 86400000); // Adds milliseconds of the day

    const newTransaction = {
      id: uniqueTimestamp, // Use the new unique timestamp from the date input
      description: description,
      type: "User Entry",
      amount: type === 'earning' ? parseFloat(amount) : -parseFloat(amount)
    };

    // This updates the state, triggering React to re-render all child components
    // We sort by ID (date) descending, so the newest is always on top
    setTransactions(prevTransactions => 
      [newTransaction, ...prevTransactions]
        .sort((a, b) => b.id - a.id)
    );

    // Close modal and reset fields
    setShowForm(false);
    setAmount('');
    setDescription('');
    setType('earning');
    setDate(new Date().toISOString().slice(0, 10)); // Reset date to today
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search a transaction"
            className="bg-[#161b22] text-gray-300 p-3 rounded-lg w-1/3 focus:outline-none"
          />
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        </div>

        {/* Cards now show MONTHLY income/expense and TOTAL balance */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <DashboardCard title="This Month's Income" amount={`₹${income.toFixed(2)}`} />
          <DashboardCard title="This Month's Expense" amount={`₹${expense.toFixed(2)}`} />
          <DashboardCard title="Total Balance" amount={`₹${balance.toFixed(2)}`} />
        </div>

        {/* Chart (shows yearly monthly report) */}
        <div className="bg-[#161b22] p-4 rounded-xl mb-6 h-96">
          <ChartComponent transactions={transactions} />
        </div>

        {/* Transaction Table (shows daily report) */}
        <TransactionTable transactions={transactions} />
      </div>

      {/* --- The "Add" Button (Floating) --- */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-[#00df9a] hover:bg-[#00c285] text-white w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg transition-transform transform hover:scale-110"
      >
        +
      </button>

      {/* --- The Add Transaction Form (Modal) --- */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)} // Close on overlay click
        >
          <div
            className="bg-[#161b22] p-8 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Stop click from closing modal
          >
            <h2 className="text-2xl font-semibold mb-6">Add New Transaction</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Type:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 bg-[#0d1117] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="earning">Earning</option>
                  <option value="spent">Spent</option>
                </select>
              </div>

              {/* --- NEW DATE INPUT --- */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-3 bg-[#0d1117] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Amount (₹):</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full p-3 bg-[#0d1117] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Groceries, Salary"
                  required
                  className="w-full p-3 bg-[#0d1117] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2 px-5 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#00df9a] hover:bg-[#00c285] text-black font-medium rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;