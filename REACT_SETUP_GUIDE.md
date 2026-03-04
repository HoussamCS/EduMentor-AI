# EduMentor AI - Professional React Frontend Setup Guide

## 🎉 Welcome!

Your EduMentor AI application has been upgraded with a professional React frontend using Material-UI. This guide will help you get started.

## 📋 What's New

### Frontend Technologies
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional component library
- **Axios** - HTTP client for API calls
- **Responsive Design** - Works on all devices

### Project Structure
```
EduMentor AI/
├── app.py                 # Python Flask backend (no changes needed)
├── src/                   # Backend source code
├── frontend/              # NEW: React TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── services/     # API calls and services
│   │   ├── types/        # TypeScript type definitions
│   │   ├── App.tsx       # Main app component
│   │   └── index.tsx     # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── templates/             # OLD: Legacy HTML template (still available)
```

## 🚀 Quick Start

### Option 1: Development Mode (Recommended for Development)

#### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Start Frontend Dev Server
```bash
npm start
```
This will open http://localhost:3000 in your browser. The app will auto-reload when you make changes.

#### Step 3: In Another Terminal, Start Backend
```bash
python -m pip install -r requirements.txt
python app.py
```
Backend runs on http://localhost:5000

#### Result
- Frontend: http://localhost:3000 (with hot reload)
- Backend: http://localhost:5000 (API)

### Option 2: Production Mode (After Building)

#### Step 1: Build Frontend for Production
```bash
cd frontend
npm install
npm run build
```
This creates a `frontend/build` folder with optimized assets.

#### Step 2: Start Backend Only
```bash
python app.py
```
Backend will serve the React frontend from http://localhost:5000

---

## 📱 Features Overview

### 🤖 Course Chat Tab
- Interactive chat with AI tutor
- Real-time message display
- Scroll-to-latest-message
- Loading indicators

### 📝 Exercise Generator Tab
- Select topic from dropdown
- Choose difficulty level
- Generate custom exercises
- Submit answers (ready for implementation)

### 📊 Analytics Dashboard Tab
- Professional form with dropdowns and inputs
- Student record data entry
- Risk prediction
- Human-readable results display

---

## ⚙️ Configuration

### API Base URL
Edit `frontend/.env`:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

For production:
```
REACT_APP_API_BASE_URL=https://your-domain.com
```

### Backend CORS
The backend has CORS enabled in `app.py`. It should accept requests from localhost:3000 by default.

---

## 📦 Available npm Commands

```bash
npm start      # Start development server (port 3000)
npm run build  # Build for production
npm test       # Run tests
npm run eject  # Eject from Create React App (not reversible!)
```

---

## 🎨 Customization

### Change Theme Colors
Edit `src/index.tsx`, find `createTheme`:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: "#your-color" },
    secondary: { main: "#your-color" },
  },
});
```

### Add New Components
1. Create file in `src/components/YourComponent.tsx`
2. Import and use in `src/App.tsx`

### Add New API Endpoints
1. Add method in `src/services/api.ts`
2. Call in your components

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### CORS Errors
Ensure backend has CORS enabled:
```python
from flask_cors import CORS
CORS(app)
```

### API Not Connecting
1. Check backend is running: http://localhost:5000/api/health
2. Check `.env` REACT_APP_API_BASE_URL
3. Check browser console for errors

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔄 Development Workflow

1. **Update API Service** (`src/services/api.ts`)
   - Add new endpoint functions

2. **Create Components** (`src/components/`)
   - Reusable, self-contained React components

3. **Update Types** (`src/types/index.ts`)
   - Keep TypeScript types in sync

4. **Test Changes**
   - Frontend: http://localhost:3000 (auto-reload)
   - Backend: Check API responses

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com)

---

## ✨ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start development: `npm start`
3. ✅ Visit http://localhost:3000
4. ✅ Test the three tabs
5. ✅ Customize colors and content
6. ✅ Deploy to production

---

## 📝 Notes

- The old Flask template (`templates/index.html`) is still available as a fallback
- When you build React, the backend can serve it directly
- All API calls use the configured `REACT_APP_API_BASE_URL`
- TypeScript provides type safety throughout the application

---

Happy coding! 🎓
