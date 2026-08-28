# Mecanosfera

Plataforma de artículos informativos con foro de comentarios.

## Stack
- Backend: Spring Boot (Java) + PostgreSQL
- Frontend: Next.js (TypeScript) + Tailwind CSS

## Estructura del repo
```
├── backend/ # API REST (Spring Boot)
├── frontend/ # Cliente web (Next.js)
```

## Cómo correr el proyecto en local

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Levanta en `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Levanta en `http://localhost:3000`

## Variables de entorno
Cada carpeta (`backend/`, `frontend/`) necesita su propio `.env` (no versionado). Ver `.env.example` en cada una (pendiente de crear).