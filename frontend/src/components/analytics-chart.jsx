import {useMemo} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function AnalyticsChart() {
  // Generate stub data for last 7 days
  const chartData = useMemo(() => {
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        alice: Math.floor(Math.random() * 4 + 1), // 1-5 hours
        bob: Math.floor(Math.random() * 4 + 1),
        charlie: Math.floor(Math.random() * 4 + 1),
      });
    }
    
    return data;
  }, []);

  const colors = {
    alice: '#3b82f6',
    bob: '#10b981', 
    charlie: '#f59e0b',
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Time Logged per Day per User</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{value: 'Hours', angle: -90, position: 'insideLeft'}} />
          <Tooltip formatter={(value) => `${value} hours`} />
          <Legend />
          <Line type="monotone" dataKey="alice" stroke={colors.alice} strokeWidth={2} />
          <Line type="monotone" dataKey="bob" stroke={colors.bob} strokeWidth={2} />
          <Line type="monotone" dataKey="charlie" stroke={colors.charlie} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}