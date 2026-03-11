# BookEz — Система бронирования отелей

BookEz — это современное Fullstack-приложение, реализующее полный цикл бронирования номеров в отеле: от поиска и фильтрации до полного управления отелем и администрирования контента.

Приложение развернуто на облачном сервере и доступно по адресу:

**[http://85.239.63.108](http://85.239.63.108)**

## Основные возможности
- **Поиск и фильтрация:** &nbsp; Поиск отелей по городам, датам и названию.

- **Управление бронированием:** &nbsp; Система создания и отслеживания заказов.

- **Личный кабинет:** &nbsp; Авторизация пользователей с использованием JWT-токенов.

- **Панель менеджера:** &nbsp;Возможность добавления новых отелей и управления контентом.

- **Панель админ:** &nbsp;Возможность переназначать роли и количество доступных для создания отелей и номеров

- **Загрузка фото:** &nbsp;Интеграция с Multer для хранения изображений отелей.

## Особенности
- **SPA Архитектура:** &nbsp; Быстрая работа интерфейса без перезагрузок страниц

- **RBAC (Role-Based Access Control):** &nbsp;Продвинутая система прав (Admin/Manager/User)

- **Безопасность:** &nbsp;Хеширование паролей через bcrypt и защищенные маршруты на фронтенде.

- **Интерактивность:** &nbsp;Система отзывов, моментальное обновление статусов бронирования.

- **Media Management:** &nbsp; Обработка и хранение изображений через Multer с привязкой к сущностям БД.

## Технологический стек

### Frontend
- **React 19 (SPA), TypeScript:** &nbsp;ядро, функциональные компоненты и хуки.

- **Redux:** &nbsp;стейт-менеджмент (Thunk для асинхронных операций).

- **React Router DOM:** &nbsp;навигация.

- **React Hook Form + Yup:** &nbsp;работа с формами(схемная валидация).

- **Tailwind CSS 4 + Lucide React:** &nbsp;стилизация и иконки.

- **Vite, ESLint, Prettier:** &nbsp; сборка и инструменты.

### Backend
- **Node.js, Express, TypeScript.:** &nbsp;серверная логика и REST API.

- **MongoDB + Mongoose ODM:** &nbsp;база данных и моделирование данных.

- **JWT, Bcrypt.js:** &nbsp; аутентификация пользователей (Stateless session, хеширование паролей).

- **Multer:** &nbsp;загрузка изображений(обработка Multipart/form-data).

- **CORS middleware:** &nbsp;безопасность.

### DevOps & Deployment:
* **Docker & Docker Compose** — контейнеризация приложения и базы данных.

* **Timeweb Cloud** — хостинг (VPS на Ubuntu).

* **Linux (Ubuntu)** — администрирование сервера.

Проект полностью подготовлен к деплою через Docker. В корне проекта находится многоэтапный `Dockerfile`.


### Инструкция: Как запустить проект через Docker

Для запуска проекта вам понадобится установленный **Docker**.

1. Клонируйте репозиторий:
  - git clone [https://github.com/Andrey-G1Thub/bookez-hotel-booking.git](https://github.com/Andrey-G1Thub/bookez-hotel-booking.git)
- cd bookez-hotel-booking

2. Настройка окружения. Создайте файл .env в корневой папке проекта и добавьте в него следующие переменные:

- MONGO_URI=mongodb://admin:adminpass@diplom-mongodb:27017/hoteldb?authSource=admin
- PORT=5000
- JWT_SECRET=super_secret_key_2026

3. Создайте сеть:
- `docker network create hotel-network`

4. Запуск базы данных MongoDB:
- `docker run -d --name diplom-mongodb --network hotel-network -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=adminpass --restart always mongo:latest`

5. Соберите образ приложения:
 - `docker build -t hotel-app .`

6. Запустите приложение:
- `docker run -d --name hotel-booking-live --network hotel-network -p 80:5000 --env-file .env -v $(pwd)/backend/uploads:/app/backend/uploads --restart always hotel-app`

### Как запустить проект для разработки (Development)

### backend
* cd backend
* npm install
* npm run dev

### frontend
* cd frontend
* npm install
* npm run dev

![Главная_для_админа](./frontend/screenshots/Главная_для_админа.png)
![Панель_админа](./frontend/screenshots/Панель_админа.png)
![Панель_менеджера](./frontend/screenshots/Панель_менеджера.png)
![Страница_броней](./frontend/screenshots/Страница_броней.png)
![Страница_номера](./frontend/screenshots/Страница_номера.png)
![Страница_отеля](./frontend/screenshots/Страница_отеля.png)
