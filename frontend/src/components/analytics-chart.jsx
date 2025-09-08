import {useState, useEffect} from 'react';
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
import {getTimeLoggedPerDay} from '../services/analytics';

export function AnalyticsChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTimeLoggedPerDay();
        if (response.data && response.data.length > 0) {
          setChartData(response.data);

          const allUsers = new Set();
          response.data.forEach(day => {
            Object.keys(day).forEach(key => {
              if (key !== 'date') allUsers.add(key);
            });
          });
          setUsers(Array.from(allUsers));
        } else {
          setChartData([]);
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setChartData([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Time Logged per Day per User</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Time Logged per Day per User</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No time tracking data available</p>
          <p className="text-sm text-gray-400 mt-2">
            Start logging time on tasks to see analytics
          </p>
        </div>
      </div>
    );
  }

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
          {users.map((user, index) => (
            <Line
              key={user}
              type="monotone"
              dataKey={user}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}