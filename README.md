# 🩸 Blood Bank Management System - Frontend

A modern React application for managing blood bank operations with role-based access control.

## 🚀 Live Demo

- **Frontend**: [Your Netlify URL]
- **Backend API**: https://blood-bank-4a5247a51f8b.herokuapp.com/api

## ✨ Features

### 👥 User Features
- User registration and authentication
- Donor management (add, edit, view donors)
- Blood stock viewing
- Responsive design for all devices

### 🛡️ Admin Features
- Complete dashboard with statistics
- Blood stock management
- Blood request approval/rejection
- User management
- System monitoring

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **Authentication**: JWT tokens
- **Icons**: Lucide React

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/blood-bank-frontend.git
   cd blood-bank-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env.local for development
   echo "VITE_API_URL=http://localhost:8080/api" > .env.local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:8080
   ```

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Push to GitHub**
2. **Connect to Netlify**
3. **Netlify will auto-detect the configuration from `netlify.toml`**
4. **Deploy!**

Build settings (auto-configured):
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Pre-configured in netlify.toml

## 🔐 Authentication

### Default Test Accounts
Since the backend doesn't create default users, you'll need to:

1. **Sign up** for a new account (defaults to USER role)
2. **Promote to admin** using one of these methods:

#### Method 1: Emergency Promotion API
```bash
curl -X POST https://blood-bank-4a5247a51f8b.herokuapp.com/api/system/promote-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","secret":"BLOOD_BANK_ADMIN_SECRET_2024"}'
```

#### Method 2: Heroku CLI (Database)
```bash
heroku pg:psql --app blood-bank
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
\q
```

## 🌐 API Integration

The frontend connects to the Spring Boot backend:
- **Base URL**: `https://blood-bank-4a5247a51f8b.herokuapp.com/api`
- **Authentication**: JWT Bearer tokens
- **CORS**: Configured for all origins

### API Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `GET /dashboard/stats` - Dashboard statistics (Admin)
- `GET /donors` - Donor management
- `GET /stock` - Blood stock management (Admin)
- `GET /requests` - Blood request management (Admin)

## 📱 Features Overview

### 🏠 Dashboard
- Real-time statistics
- System health monitoring
- Quick access to all features

### 👥 Donor Management
- Add new donors
- Edit donor information
- View donor history
- Search and filter donors

### 🩸 Blood Stock (Admin Only)
- View current stock levels
- Update quantities
- Monitor expiring stock
- Blood group management

### 📋 Request Management (Admin Only)
- View blood requests
- Approve/reject requests
- Track request status
- Request history

## 🎨 UI Components

Built with **shadcn/ui** components:
- Modern, accessible design
- Dark/light theme support
- Responsive layouts
- Smooth animations

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API service
├── pages/              # Page components
└── App.tsx             # Main application component
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend is running
   - Verify VITE_API_URL environment variable
   - Check browser console for CORS errors

2. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 18+)

3. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration
   - Verify backend authentication endpoints

## 📄 License

This project is part of a DBMS course project.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for blood bank management**