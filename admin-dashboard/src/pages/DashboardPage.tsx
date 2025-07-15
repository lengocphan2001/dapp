import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats, ChartData } from '../types';
import apiService from '../services/api';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([]);
  const [transactionData, setTransactionData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, userGrowthResponse, transactionResponse, revenueResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getUserGrowthData(7),
          apiService.getTransactionVolumeData(7),
          apiService.getRevenueData(7)
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (userGrowthResponse.success && userGrowthResponse.data) {
          setUserGrowthData(userGrowthResponse.data.map(item => ({
            name: new Date(item.date).toLocaleDateString(),
            value: item.users
          })));
        }

        if (transactionResponse.success && transactionResponse.data) {
          setTransactionData(transactionResponse.data.map(item => ({
            name: new Date(item.date).toLocaleDateString(),
            value: item.volume
          })));
        }

        if (revenueResponse.success && revenueResponse.data) {
          setRevenueData(revenueResponse.data.map(item => ({
            name: new Date(item.date).toLocaleDateString(),
            value: item.revenue
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.users.total || 0}
            change={12}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Users"
            value={stats?.users.active || 0}
            change={8}
            icon={<Activity className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Transactions"
            value={stats?.transactions.total || 0}
            change={-3}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.revenue.total || 0).toLocaleString()}`}
            change={15}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction Volume Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume (Last 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-600">@john_doe joined the platform</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Large deposit completed</p>
                  <p className="text-sm text-gray-600">$5,000 deposit by @crypto_trader</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">15 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">Staking reward distributed</p>
                  <p className="text-sm text-gray-600">Rewards sent to 1,234 users</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 