npm run json-server сапуск сервера
npm run dev запуск проекта

## Установленные пакеты 0. npm install

1. json-server@0.17.4 --save-dev
2. npm install tailwindcss @tailwindcss/vite
3. npm install --save prop-types
4. npm install react-hook-form
5. npm install react-router-dom@latest
6. npm install yup redux redux-thunk react-redux

## . Структура Папок: Создайть базовую структуру:

o src/components/ (многократно используемые компоненты: кнопки, инпуты)
o src/pages/ (основные страницы)
o src/routes/ (настройка маршрутизации)
o src/services/ (сервисы для взаимодействия с API)
o src/store/ (глобальное состояние)

## . Проектирование Базы Данных (Data Schema)

1. Users:
   o id, email (UNIQUE), password (HASHED), role (['guest', 'user', 'admin', 'manager']), name.
2. Properties (Объекты/Номера):
   o id, title, description, price_per_night, city, amenities (JSON/Array), images (JSON/Array), is_active (boolean).
3. Bookings (Бронирования):
   o id, user_id (FK), property_id (FK), check_in_date, check_out_date, total_price, status (['pending', 'confirmed', 'cancelled']).
4. Reviews (Отзывы) & Likes:
   o Reviews: id, user_id (FK), property_id (FK), text, rating, created_at.
   o Likes (Отдельная таблица/модель): id, user_id (FK), property_id (FK).
