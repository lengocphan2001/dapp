import { Router, Request, Response } from 'express';
import { users, findUserById, getUsersWithFilters } from '../data/mockData';
import { User } from '../types';

const router = Router();

// Get all users with pagination and filters
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      search: req.query.search as string,
      role: req.query.role as 'user' | 'admin',
      status: req.query.status as 'active' | 'inactive',
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = getUsersWithFilters(filters, page, limit);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user role
router.put('/:id/role', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Valid role is required (user or admin)'
      });
    }

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    users[userIndex].role = role;

    res.json({
      success: true,
      data: users[userIndex]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Toggle user status
router.put('/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    users[userIndex].isActive = !users[userIndex].isActive;

    res.json({
      success: true,
      data: users[userIndex]
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove user from array
    users.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 