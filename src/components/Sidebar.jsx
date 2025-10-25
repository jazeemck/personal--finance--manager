import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#161b22] p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8 text-green-400">PayFinance</h2>
      <ul className="space-y-4">
        <li className="hover:text-green-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-green-400 cursor-pointer">Invoice</li>
        <li className="hover:text-green-400 cursor-pointer">Message</li>
        <li className="hover:text-green-400 cursor-pointer">Activity</li>
        <li className="hover:text-green-400 cursor-pointer">Notifications</li>
        <li className="hover:text-green-400 cursor-pointer">Analytics</li>
      </ul>

      <div className="mt-auto pt-6 border-t border-gray-700">
        <button className="text-gray-400 hover:text-green-400 text-sm">
          ⚙ Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
