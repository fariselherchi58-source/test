services:
  db:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: schiphol_sim
      POSTGRES_USER: sim
      POSTGRES_PASSWORD: sim
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/schema.sql:/docker-entrypoint-initdb.d/001_schema.sql:ro

  backend:
    build: ./backend
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - db
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

volumes:
  pgdata:
