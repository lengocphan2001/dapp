# DeFi Admin API

A Node.js/Express API server for the DeFi Admin Dashboard with JWT authentication and comprehensive user management.

## Features

- 🔐 **JWT Authentication** - Secure admin login/logout
- 👥 **User Management** - Complete CRUD operations for users
- 📊 **Dashboard Analytics** - Real-time statistics and metrics
- 📈 **Data Visualization** - Chart data for analytics
- 🛡️ **Role-based Access** - Admin and Super Admin roles
- 📱 **RESTful API** - Clean, consistent endpoints
- 🎯 **TypeScript** - Full type safety

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT + bcryptjs
- **CORS**: Enabled for frontend integration

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

#### POST `/api/admin/auth/login`
Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@defi.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "1",
      "email": "admin@defi.com",
      "name": "Admin User",
      "role": "super_admin",
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### POST `/api/admin/auth/logout`
Admin logout endpoint.

#### GET `/api/admin/auth/me`
Get current admin information (requires authentication).

### Dashboard

#### GET `/api/admin/dashboard/stats`
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 4,
      "active": 3,
      "newToday": 0,
      "newThisWeek": 1
    },
    "transactions": {
      "total": 4,
      "today": 0,
      "thisWeek": 1,
      "totalVolume": 13500
    },
    "deposits": {
      "total": 4,
      "today": 0,
      "thisWeek": 1,
      "totalAmount": 14500
    },
    "revenue": {
      "total": 290,
      "today": 0,
      "thisWeek": 20,
      "thisMonth": 290
    }
  }
}
```

### Users

#### GET `/api/admin/users`
Get paginated users list with filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `role` (string): Filter by role (user/admin)
- `status` (string): Filter by status (active/inactive)
- `sortBy` (string): Sort field
- `sortOrder` (string): Sort direction (asc/desc)

#### GET `/api/admin/users/:id`
Get user by ID.

#### PUT `/api/admin/users/:id/role`
Update user role.

**Request Body:**
```json
{
  "role": "admin"
}
```

#### PUT `/api/admin/users/:id/status`
Toggle user active status.

#### DELETE `/api/admin/users/:id`
Delete user.

### Analytics

#### GET `/api/admin/analytics/user-growth`
Get user growth data for charts.

**Query Parameters:**
- `days` (number): Number of days (default: 30)

#### GET `/api/admin/analytics/transaction-volume`
Get transaction volume data for charts.

#### GET `/api/admin/analytics/revenue`
Get revenue data for charts.

#### GET `/api/admin/analytics/transaction-types`
Get transaction types distribution.

#### GET `/api/admin/analytics/deposit-methods`
Get deposit methods distribution.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Demo Credentials

For testing purposes, use these credentials:

- **Email**: `admin@defi.com`
- **Password**: `admin123`

- **Email**: `moderator@defi.com`
- **Password**: `admin123`

## Mock Data

The API includes comprehensive mock data for testing:

- **4 Users** with different roles and statuses
- **4 Transactions** of various types
- **4 Deposits** with different methods and statuses
- **2 Admin Users** with different roles

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure

```
src/
├── data/           # Mock data and helper functions
│   └── mockData.ts
├── middleware/     # Express middleware
│   └── auth.ts
├── routes/         # API route handlers
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── users.ts
│   └── analytics.ts
├── types/          # TypeScript type definitions
│   └── index.ts
└── index.ts        # Main server file
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

## Deployment

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-change-this-in-production` |
| `NODE_ENV` | Environment mode | `development` |

### Production Build

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## Security Considerations

- Change the default JWT secret in production
- Implement proper password hashing in production
- Add rate limiting for production use
- Use HTTPS in production
- Implement proper input validation
- Add request logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 