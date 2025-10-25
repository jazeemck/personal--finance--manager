// src/components/ChartComponent.js

import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

const ChartComponent = ({ transactions }) => {

  const chartData = useMemo(() => {
    // 1. Get the current year. The chart will be fixed to this year.
    const currentYear = new Date().getFullYear(); // e.g., 2025
    
    // 2. Helper array for month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // 3. A temporary object to group data.
    // We'll pre-fill it for ALL 12 months of the current year.
    const dataByMonth = {};
    for (let i = 0; i < 12; i++) { // Loop 12 times (for Jan to Dec)
      const monthKey = `${currentYear}-${i}`; // e.g., "2025-0", "2025-1", ... "2025-11"
      const monthName = monthNames[i];
      dataByMonth[monthKey] = { name: monthName, income: 0, expense: 0 };
    }

    // 4. Process all transactions
    transactions.forEach(tx => {
      const date = new Date(tx.id); // 'id' is our timestamp
      const txYear = date.getFullYear();

      // 5. IMPORTANT: Only include transactions from the current year
      if (txYear === currentYear) {
        const monthKey = `${txYear}-${date.getMonth()}`; // e.g., "2025-9" for October

        // We can safely add it because dataByMonth has all 12 keys
        if (dataByMonth[monthKey]) { 
          if (tx.amount > 0) {
            dataByMonth[monthKey].income += tx.amount;
          } else {
            dataByMonth[monthKey].expense += Math.abs(tx.amount); // Store as positive
          }
        }
      }
    });

    // 6. Convert the object back into an array for recharts
    return Object.values(dataByMonth);

  }, [transactions]); // The dependency array

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={chartData}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF" 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#9CA3AF" 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `₹${value}`} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#161b22', border: 'none', borderRadius: '8px' }} 
          labelStyle={{ color: '#F9FAFB' }}
          formatter={(value, name) => [`₹${value.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#22C55E" // Green
          strokeWidth={2} 
          dot={{ r: 4 }} 
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="expense" 
          stroke="#EF4444" // Red
          strokeWidth={2} 
          dot={{ r: 4 }} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;