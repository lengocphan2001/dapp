import { Router, Request, Response } from 'express';
import { users, transactions, deposits } from '../data/mockData';
import { DashboardStats } from '../types';

const router = Router();

// Get dashboard statistics
router.get('/stats', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate user statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const newUsersToday = users.filter(user => user.createdAt >= today).length;
    const newUsersThisWeek = users.filter(user => user.createdAt >= weekAgo).length;

    // Calculate transaction statistics
    const totalTransactions = transactions.length;
    const todayTransactions = transactions.filter(tx => tx.createdAt >= today).length;
    const weekTransactions = transactions.filter(tx => tx.createdAt >= weekAgo).length;
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate deposit statistics
    const totalDeposits = deposits.length;
    const todayDeposits = deposits.filter(dep => dep.createdAt >= today).length;
    const weekDeposits = deposits.filter(dep => dep.createdAt >= weekAgo).length;
    const totalAmount = deposits.reduce((sum, dep) => sum + dep.amount, 0);

    // Calculate revenue (simplified - in real app this would be more complex)
    const totalRevenue = totalAmount * 0.02; // 2% fee
    const todayRevenue = deposits
      .filter(dep => dep.createdAt >= today)
      .reduce((sum, dep) => sum + dep.amount * 0.02, 0);
    const weekRevenue = deposits
      .filter(dep => dep.createdAt >= weekAgo)
      .reduce((sum, dep) => sum + dep.amount * 0.02, 0);
    const monthRevenue = deposits
      .filter(dep => dep.createdAt >= monthAgo)
      .reduce((sum, dep) => sum + dep.amount * 0.02, 0);

    const stats: DashboardStats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
      },
      transactions: {
        total: totalTransactions,
        today: todayTransactions,
        thisWeek: weekTransactions,
        totalVolume: totalVolume,
      },
      deposits: {
        total: totalDeposits,
        today: todayDeposits,
        thisWeek: weekDeposits,
        totalAmount: totalAmount,
      },
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        thisWeek: weekRevenue,
        thisMonth: monthRevenue,
      },
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get admin statistics (legacy endpoint)
router.get('/admin-stats', (req: Request, res: Response) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const newUsersToday = users.filter(user => user.createdAt >= today).length;
    const newUsersThisWeek = users.filter(user => user.createdAt >= weekAgo).length;
    const totalDeposits = deposits.reduce((sum, dep) => sum + dep.amount, 0);
    const totalTransactions = transactions.length;
    const averageDeposit = totalDeposits / deposits.length || 0;
    const topUsers = users
      .sort((a, b) => (b.totalDeposits || 0) - (a.totalDeposits || 0))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersThisWeek,
        totalDeposits,
        totalTransactions,
        averageDeposit,
        topUsers,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 