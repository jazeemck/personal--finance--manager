import React from "react";

const DashboardCard = ({ title, amount }) => {
  return (
    <div className="bg-[#161b22] p-5 rounded-xl text-center shadow-md hover:scale-105 transition-transform duration-200">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{amount}</p>
    </div>
  );
};

export default DashboardCard;
