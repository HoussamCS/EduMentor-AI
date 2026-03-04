# EduMentor AI - React Frontend

A professional React + TypeScript + Material-UI frontend for EduMentor AI application.

## Features

- 🤖 **Course Chat**: Interactive tutoring assistant
- 📝 **Exercise Generator**: Generate custom exercises by topic and difficulty
- 📊 **Analytics Dashboard**: Student risk assessment and prediction
- 🎨 **Modern UI**: Material-UI components with professional design
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env` template:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Available Scripts

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── ChatTab.tsx
│   ├── ExerciseTab.tsx
│   ├── AnalyticsTab.tsx
│   └── Loader.tsx
├── pages/           # Page components (if needed)
├── services/        # API and external service calls
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component
├── index.tsx        # React DOM rendering
└── index.css        # Global styles
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client for API calls
- **Emotion** - CSS-in-JS styling

## API Integration

The app connects to the backend API at `http://localhost:5000` (configurable via `.env`).

### API Endpoints Used

- `POST /api/chat` - Send chat message
- `POST /api/exercise` - Generate exercise
- `POST /api/risk` - Predict student risk
- `GET /api/health` - Health check

## Customization

### Changing API Base URL

Edit `.env`:

```
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

### Theming

Edit theme in `src/index.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: "#your-color" },
    // ...
  },
});
```

## Production Build

1. Build the application:

```bash
npm run build
```

2. The build folder contains static assets ready for deployment.

## Troubleshooting

### Port already in use

If port 3000 is already in use:

```bash
PORT=3001 npm start
```

### API connection issues

Ensure your backend is running at the configured API_BASE_URL. Check browser console for CORS errors.

## License

MIT
