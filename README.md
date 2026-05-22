services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/app:/app/app

  frontend:
    build: ./frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8000
      VITE_WS_URL: ws://localhost:8000/ws/traffic
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src
