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

Configura estas variables en el proveedor de despliegue. Para desarrollo local, usa archivos `.env` no versionados.

Backend:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (mínimo 32 bytes para HS256)
- `APP_CORS_ALLOWED_ORIGINS` (origen del frontend, por ejemplo `https://tu-sitio.example`)
- `PORT` (opcional; por defecto `10000`)

Frontend:
- `NEXT_PUBLIC_API_URL` (URL pública HTTPS del backend, sin barra final)

En Vercel, configura `frontend/` como Root Directory. El backend debe construirse con `backend/` como contexto Docker.
