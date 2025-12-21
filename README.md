# Financial Report Uploader

A modern, modular React app for uploading, processing, and categorizing financial reports. Features drag-and-drop domain assignment, sortable tables, and a clean, responsive UI.

## Features
- Upload and process Excel/CSV financial files
- Assign domains to transactions via drag-and-drop or select
- Sortable, filterable transaction table
- Domain sidebar with color coding and sum display
- Modular React components, hooks, and utilities
- CSS Modules for scoped styling
- Error handling and loading states

## Setup

### Using Docker (Recommended)

**Development (with hot-reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Production:**
```bash
docker-compose up --build
```
- Application: http://localhost:80

### Manual Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend 
uv run main.py
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_APP` | Flask application entry point | `main.py` |
| `FLASK_ENV` | Flask environment mode | `production` / `development` |
| `FLASK_DEBUG` | Enable Flask debug mode (dev only) | `1` |
| `NODE_ENV` | Node environment | `production` / `development` |
| `VITE_API_URL` | Backend API URL (dev only) | `http://backend:5000` |

## Project Structure
```
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── editor/
│   ├── parsers/
│   ├── rpc/
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Screenshot
![screenshot](screenshot.png)

## License
MIT
