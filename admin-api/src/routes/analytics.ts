import { Router, Request, Response } from 'express';
import { users, transactions, deposits } from '../data/mockData';

const router = Router();

// Get user growth data
router.get('/user-growth', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const usersOnDay = users.filter(user => 
        user.createdAt >= startOfDay && user.createdAt < endOfDay
      ).length;

      data.push({
        date: startOfDay.toISOString().split('T')[0],
        users: usersOnDay
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('User growth error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get transaction volume data
router.get('/transaction-volume', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const volumeOnDay = transactions
        .filter(tx => tx.createdAt >= startOfDay && tx.createdAt < endOfDay)
        .reduce((sum, tx) => sum + tx.amount, 0);

      data.push({
        date: startOfDay.toISOString().split('T')[0],
        volume: volumeOnDay
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Transaction volume error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get revenue data
router.get('/revenue', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const revenueOnDay = deposits
        .filter(dep => dep.createdAt >= startOfDay && dep.createdAt < endOfDay)
        .reduce((sum, dep) => sum + dep.amount * 0.02, 0); // 2% fee

      data.push({
        date: startOfDay.toISOString().split('T')[0],
        revenue: revenueOnDay
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get transaction types distribution
router.get('/transaction-types', (req: Request, res: Response) => {
  try {
    const typeCounts: { [key: string]: number } = {};
    
    transactions.forEach(tx => {
      typeCounts[tx.type] = (typeCounts[tx.type] || 0) + 1;
    });

    const data = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Transaction types error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get deposit methods distribution
router.get('/deposit-methods', (req: Request, res: Response) => {
  try {
    const methodCounts: { [key: string]: number } = {};
    
    deposits.forEach(dep => {
      methodCounts[dep.method] = (methodCounts[dep.method] || 0) + 1;
    });

    const data = Object.entries(methodCounts).map(([method, count]) => ({
      name: method,
      value: count
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Deposit methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 