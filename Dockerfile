# Сборка фронтенда 
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Сборка бэкенда 
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./


COPY --from=build-frontend /app/frontend/dist ./public

# Компилируем TypeScript бэкенда
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]