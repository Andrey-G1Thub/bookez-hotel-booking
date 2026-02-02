import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, Calendar, User, LogOut, MapPin, DollarSign, Hotel, Home, Zap } from 'lucide-react';

// -------------------------------------------------------------------------
// 1. Стилизация (CSS)
// -------------------------------------------------------------------------

const CustomStyles = () => (

<style jsx="true">{`
:root {
--primary-accent: #00A3A8; /_ Глубокий бирюзовый _/
--primary-accent-dark: #007C80;
--secondary-bg: #f7f9fc; /_ Светло-серый фон _/
}

        /* Текст, границы и фон с акцентом */
        .accent-text {
            color: var(--primary-accent);
        }
        .accent-border {
            border-color: var(--primary-accent);
        }
        .accent-color {
            background-color: var(--primary-accent);
        }
        .accent-hover:hover {
            background-color: var(--primary-accent-dark) !important;
            transform: translateY(-1px);
        }

        /* Тень для карточек */
        .card-shadow {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            border-radius: 1rem;
        }

        /* Общие стили для всего приложения */
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--secondary-bg);
        }
        a, button {
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
    `}</style>

);

// -------------------------------------------------------------------------

<!-- // 2. Mock-данные (Заглушки для работы с каталогом)
// -------------------------------------------------------------------------

const MOCK_DATA = {
CITIES: [
{ id: 1, name: 'Москва', description: 'Сердце России.' },
{ id: 2, name: 'Санкт-Петербург', description: 'Северная столица.' },
{ id: 3, name: 'Сочи', description: 'Черноморский курорт.' },
],
HOTELS: [
{ id: 101, cityId: 1, name: 'Москва Гранд Отель', rating: 5, reviewCount: 1200, priceFrom: 8500, description: 'Роскошь и комфорт в центре столицы.' },
{ id: 102, cityId: 1, name: 'Отель у Парка', rating: 4, reviewCount: 550, priceFrom: 5200, description: 'Идеально для семейного отдыха.' },
{ id: 201, cityId: 2, name: 'Невский Люкс', rating: 5, reviewCount: 980, priceFrom: 9800, description: 'Вид на Дворцовую площадь.' },
{ id: 301, cityId: 3, name: 'Солнечный Берег', rating: 4, reviewCount: 2100, priceFrom: 4500, description: 'Прямой выход к морю.' },
],
ROOMS: [
{ id: 1001, hotelId: 101, type: 'Стандартный Двухместный', capacity: 2, amenities: 'WiFi, ТВ, Кондиционер', price: 8500 },
{ id: 1002, hotelId: 101, type: 'Люкс с Видом', capacity: 3, amenities: 'Мини-бар, Балкон, Халаты', price: 15000 },
{ id: 2001, hotelId: 201, type: 'Студия', capacity: 2, amenities: 'Мини-кухня, Завтрак', price: 9800 },
{ id: 3001, hotelId: 301, type: 'Эконом', capacity: 2, amenities: 'Ванная комната', price: 4500 },
]
}; -->

// -------------------------------------------------------------------------
// 3. Вспомогательные Функции и Хуки
// -------------------------------------------------------------------------

/\*\*

- Хук для упрощенного Hash-роутинга.
  \*/
    <!-- const useHashRouter = () => {
    const [hash, setHash] = useState(window.location.hash.substring(1) || '');

                useEffect(() => {
                    const handleHashChange = () => {
                        setHash(window.location.hash.substring(1) || '');
                    };
                    window.addEventListener('hashchange', handleHashChange);
                    return () => window.removeEventListener('hashchange', handleHashChange);
                }, []);

                // Функция для навигации
                const navigate = useCallback((newHash) => {
                    if (newHash.startsWith('/')) {
                        newHash = newHash.substring(1);
                    }
                    window.location.hash = newHash;
                }, []);

                // Парсинг маршрута и параметров (например, 'city/1')
                const parts = hash.split('/').filter(p => p);

                let route = '/';
                let params = {};

                if (parts.length === 1) {
                    route = parts[0];
                } else if (parts[0] === 'city' && parts.length > 1) {
                    route = 'cityDetails';
                    params.cityId = parseInt(parts[1], 10);
                } else if (parts[0] === 'hotel' && parts.length > 1) {
                    route = 'hotelDetails';
                    params.hotelId = parseInt(parts[1], 10);
                } else if (parts[0] === 'room' && parts.length > 2) {
                    route = 'roomBooking';
                    params.roomId = parseInt(parts[2], 10);
                } else {
                    route = hash;
                }

                return { route: route || '/', params, navigate };

            }; -->

<!-- /\*\*

- Возвращает сегодняшнюю дату в формате YYYY-MM-DD.
  \*/
  const getMinDate = () => {
  const today = new Date();
  // Используем 'T00:00:00' для нормализации даты до начала дня по местному времени
  return today.toISOString().split('T')[0];
  };

// ------------------------------------------------------------------------- -->

// 4. Компоненты UI (Карточки, Кнопки и т.д.)
// -------------------------------------------------------------------------

const Rating = ({ rating }) => (

<div className="flex items-center text-sm font-semibold text-yellow-500">
{[...Array(5)].map((\_, i) => (
<span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
))}
</div>
);

const HotelCard = ({ hotel, navigate }) => {
// Используем чистую заглушку для изображения
const hotelImage = `https://placehold.co/400x250/E6F6F6/007C80?text=${encodeURIComponent(hotel.name)}`;

    return (
        <div
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="bg-white card-shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
            <img
                src={hotelImage}
                alt={hotel.name}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/f0f0f0/333333?text=Нет+Фото" }}
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{hotel.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <Rating rating={hotel.rating} />
                    <span className="text-sm text-gray-500">({hotel.reviewCount} отзывов)</span>
                </div>
                <p className="text-2xl font-bold accent-text mt-3">
                    от {hotel.priceFrom} ₽ <span className="text-base font-normal text-gray-500">/ ночь</span>
                </p>
                <div className="mt-4 flex justify-end">
                    <button className="flex items-center text-sm font-semibold accent-text hover:opacity-80">
                        Подробнее <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );

};

// -------------------------------------------------------------------------
// 5. Компоненты Страниц
// -------------------------------------------------------------------------

<!-- /\*_ Главная страница с поиском и каталогом городов/отелей _/
const HomePage = ({ navigate }) => {

    // Показываем все отели как рекомендуемые, чтобы не усложнять компонент
    const featuredHotels = MOCK_DATA.HOTELS.slice(0, 3);

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cityName = formData.get('city');

        if (!cityName) {
            alert('Пожалуйста, выберите город.');
            return;
        }

        const selectedCity = MOCK_DATA.CITIES.find(c => c.name === cityName);

        if (selectedCity) {
            console.log("Выполнен поиск:", Object.fromEntries(formData.entries()));
            // НАВИГАЦИЯ НА СТРАНИЦУ ГОРОДА ДЛЯ ОТОБРАЖЕНИЯ ФИЛЬТРОВАННЫХ ОТЕЛЕЙ
            navigate(`/city/${selectedCity.id}`);
        } else {
            alert('Ошибка: выбранный город не найден.');
        }
    };

    return (
        <main>
            {/* Секция Hero с Поиском */}
            <div
                className="relative h-96 accent-color"
                style={{
                    backgroundImage: "linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark))",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-4xl p-4 md:p-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-xl">
                            Бронируйте с Доверием
                        </h1>

                        {/* Модуль Поиска */}
                        <form
                            onSubmit={handleSearch}
                            className="bg-white p-4 md:p-6 rounded-xl card-shadow flex flex-col md:flex-row gap-3"
                        >
                            {/* ПОЛЕ ВЫБОРА ГОРОДА (ВЫПАДАЮЩИЙ СПИСОК) */}
                            <select
                                name="city"
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border bg-white"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Выберите город</option>
                                {MOCK_DATA.CITIES.map(city => (
                                    // Используем имя города в качестве значения
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                name="checkIn"
                                placeholder="Дата Заезда"
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
                                min={getMinDate()}
                                required
                            />
                            <input
                                type="date"
                                name="checkOut"
                                placeholder="Дата Выезда"
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
                                min={getMinDate()}
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg"
                            >
                                <Zap className="w-5 h-5 inline mr-1 -mt-1" /> Найти
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Секция с Рекомендуемыми Отелями */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
                    Популярные Отели
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredHotels.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
                    ))}
                </div>
            </div>
        </main>
    );

}; -->

<!-- /\*_ Страница деталей отеля: список номеров _/
const HotelDetailsPage = ({ params, navigate }) => {
const hotel = MOCK_DATA.HOTELS.find(h => h.id === params.hotelId);
const rooms = MOCK_DATA.ROOMS.filter(r => r.hotelId === params.hotelId);

    if (!hotel) return <NotFoundPage message="Отель не найден." navigate={navigate} />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{hotel.name}</h1>
            <div className="text-xl text-gray-600 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 accent-text" />
                Город: {MOCK_DATA.CITIES.find(c => c.id === hotel.cityId)?.name || 'Неизвестно'}
                <span className="ml-4"><Rating rating={hotel.rating} /></span>
            </div>

            <p className="text-gray-700 mb-8 max-w-3xl">{hotel.description}</p>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Доступные Номера</h2>

            <div className="space-y-6">
                {rooms.length > 0 ? (
                    rooms.map(room => (
                        <div key={room.id} className="bg-white p-6 card-shadow flex flex-col md:flex-row items-center justify-between transition hover:shadow-xl">
                            <div className="md:w-3/5">
                                <h3 className="text-2xl font-semibold accent-text mb-1">{room.type}</h3>
                                <p className="text-gray-600 text-sm flex items-center mb-2">
                                    <User className="w-4 h-4 mr-1 text-gray-500" /> Макс. гостей: {room.capacity}
                                </p>
                                <p className="text-gray-500 text-sm">Удобства: {room.amenities}</p>
                            </div>
                            <div className="md:w-2/5 mt-4 md:mt-0 md:text-right">
                                <p className="text-3xl font-bold text-gray-800">{room.price} ₽</p>
                                <p className="text-sm text-gray-500">за ночь</p>
                                <button
                                    onClick={() => navigate(`/room/${room.hotelId}/${room.id}`)}
                                    className="mt-3 px-6 py-2 rounded-lg text-white font-semibold accent-color accent-hover shadow-md"
                                >
                                    Забронировать
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">В этом отеле пока нет доступных номеров.</p>
                )}
            </div>

             <div className="mt-10">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" /> Вернуться на Главную
                </button>
            </div>
        </div>
    );

}; -->

/\*_ Страница бронирования конкретного номера _/
const RoomBookingPage = ({ params, navigate, currentUser, bookings, addBooking }) => {
const room = MOCK_DATA.ROOMS.find(r => r.id === params.roomId);

    if (!room) return <NotFoundPage message="Номер не найден." navigate={navigate} />;

    const hotel = MOCK_DATA.HOTELS.find(h => h.id === room.hotelId);

    // Фильтруем бронирования для этого номера, только подтвержденные
    const roomBookings = bookings.filter(b =>
        b.hotelName === hotel.name && b.roomType === room.type && b.status === 'Подтверждено'
    );

    // ФУНКЦИЯ ПРОВЕРКИ ПЕРЕСЕЧЕНИЯ ДАТ (ЗАПРЕТ ДВОЙНОГО БРОНИРОВАНИЯ)
    const checkDateOverlap = (checkIn, checkOut) => {
        // Нормализация дат до начала дня для корректного сравнения
        const newStart = new Date(checkIn + 'T00:00:00');
        const newEnd = new Date(checkOut + 'T00:00:00');
        const today = new Date(getMinDate() + 'T00:00:00');

        if (newStart >= newEnd) {
            return { overlap: true, message: 'Дата выезда должна быть позже даты заезда.' };
        }
        if (newStart < today) {
             return { overlap: true, message: 'Дата заезда не может быть в прошлом.' };
        }

        // Проверка на пересечение с существующими бронями
        const isOverlap = roomBookings.some(booking => {
            const bookedStart = new Date(booking.checkIn + 'T00:00:00');
            const bookedEnd = new Date(booking.checkOut + 'T00:00:00');

            // Условие пересечения: (Начало нового < Конец старого) И (Конец нового > Начало старого)
            // Это предотвращает бронирование, даже если день выезда совпадает с днем заезда
            return (newStart < bookedEnd && newEnd > bookedStart);
        });

        if (isOverlap) {
            return { overlap: true, message: 'Введенные даты пересекаются с существующим бронированием. Выберите другие даты.' };
        }

        return { overlap: false };
    };


    const handleBooking = (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Пожалуйста, войдите в систему, чтобы забронировать номер.');
            navigate('/login');
            return;
        }

        const formData = new FormData(e.target);
        const checkIn = formData.get('checkIn');
        const checkOut = formData.get('checkOut');

        const overlapResult = checkDateOverlap(checkIn, checkOut);
        if (overlapResult.overlap) {
            alert(overlapResult.message);
            return;
        }

        // Создание новой брони
        const newBooking = {
            hotelName: hotel.name,
            roomType: room.type,
            checkIn: checkIn,
            checkOut: checkOut,
            price: room.price,
        };

        addBooking(newBooking);

        alert(`Бронирование номера "${room.type}" оформлено! (Смотри консоль и раздел 'Мои Брони')`);
        navigate('/bookings');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{room.type}</h1>
            <p className="text-xl text-gray-600 mb-6 flex items-center">
                <Hotel className="w-5 h-5 mr-2 accent-text" />
                Отель: {hotel?.name || 'Неизвестно'}
            </p>

            <div className="bg-white p-6 card-shadow grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Левая колонка: Детали Номера */}
                <div>
                    <img
                        src={`https://placehold.co/600x400/007C80/ffffff?text=${encodeURIComponent(room.type)}`}
                        alt={room.type}
                        className="w-full h-auto object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Детали</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center text-gray-700"><User className="w-5 h-5 mr-2 accent-text" /> Макс. гостей: <span className="font-semibold ml-2">{room.capacity}</span></li>
                        <li className="flex items-center text-gray-700"><Zap className="w-5 h-5 mr-2 accent-text" /> Удобства: <span className="font-semibold ml-2">{room.amenities}</span></li>
                        <li className="flex items-center text-gray-700"><DollarSign className="w-5 h-5 mr-2 accent-text" /> Цена за ночь: <span className="font-semibold ml-2">{room.price} ₽</span></li>
                    </ul>
                </div>

                {/* Правая колонка: Форма Бронирования */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Calendar className="w-6 h-6 mr-2 accent-text" /> Выберите Даты</h3>

                    {/* ВИЗУАЛИЗАЦИЯ ЗАНЯТЫХ ДАТ */}
                    <div className="mb-6 max-h-32 overflow-y-auto p-2 border rounded-lg bg-white">
                        <p className="text-sm font-semibold text-red-600 mb-2 border-b pb-1">Занятые Даты в календаре:</p>
                        <div className="flex flex-col gap-2">
                            {roomBookings.length > 0 ? (
                                roomBookings.map((b, index) => (
                                    <span key={index} className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded font-medium shadow-sm">
                                        {b.checkIn} — {b.checkOut} ({b.roomType})
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-green-600">На данный момент нет занятых дат.</span>
                            )}
                        </div>
                    </div>
                    {/* КОНЕЦ ВИЗУАЛИЗАЦИИ ЗАНЯТЫХ ДАТ */}

                    <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Дата Заезда</label>
                            <input
                                id="checkIn"
                                type="date"
                                name="checkIn"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
                                min={getMinDate()}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Дата Выезда</label>
                            <input
                                id="checkOut"
                                type="date"
                                name="checkOut"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border"
                                min={getMinDate()}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg mt-4"
                        >
                            Забронировать за {room.price} ₽
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-8">
                <button onClick={() => navigate(`/hotel/${room.hotelId}`)} className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" /> Вернуться к номерам отеля
                </button>
            </div>
        </div>
    );

};

const CityDetailsPage = ({ params, navigate }) => {
const city = MOCK_DATA.CITIES.find(c => c.id === params.cityId);
// ФИЛЬТРАЦИЯ ОТЕЛЕЙ ПО ID ГОРОДА
const hotels = MOCK_DATA.HOTELS.filter(h => h.cityId === params.cityId);

    if (!city) return <NotFoundPage message="Город не найден." navigate={navigate} />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Отели в городе {city.name}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl">{city.description}</p>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Результаты поиска</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.length > 0 ? (
                    hotels.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} navigate={navigate} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">В этом городе пока нет доступных отелей.</p>
                )}
            </div>

            <div className="mt-10">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" /> Вернуться на Главную
                </button>
            </div>
        </div>
    );

};

const LoginPage = ({ login, navigate }) => {
const handleSubmit = (e) => {
e.preventDefault();
const formData = new FormData(e.target);
const email = formData.get('email');
// Имитация получения имени из базы данных (используем часть email)
const name = email.split('@')[0];
login({ email, name });
};

    return (
        <div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Вход в BookEZ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                <input type="password" name="password" placeholder="Пароль" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg">Войти</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Нет аккаунта? <button onClick={() => navigate('/register')} className="accent-text hover:underline font-medium">Зарегистрироваться</button>
            </p>
        </div>
    );

};

const RegisterPage = ({ navigate, register }) => {
const handleRegister = (e) => {
e.preventDefault();
const formData = new FormData(e.target);
const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            alert('Пароли не совпадают. Пожалуйста, проверьте ввод.');
            return;
        }

        register({ name: data.name, email: data.email, password: data.password });
    };

    return (
        <div className="max-w-md mx-auto p-8 mt-16 bg-white card-shadow border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Регистрация</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" name="name" placeholder="Имя" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                <input type="email" name="email" placeholder="Email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                <input type="password" name="password" placeholder="Пароль" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                {/* ПОЛЕ ПОДТВЕРЖДЕНИЯ ПАРОЛЯ */}
                <input type="password" name="confirmPassword" placeholder="Подтверждение Пароля" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 accent-text focus:accent-border" />
                <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg">Зарегистрироваться</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Уже есть аккаунт? <button onClick={() => navigate('/login')} className="accent-text hover:underline font-medium">Войти</button>
            </p>
        </div>
    );

};

const BookingsPage = ({ navigate, currentUser, bookings, cancelBooking }) => {
// ФИЛЬТРАЦИЯ АКТУАЛЬНЫХ БРОНИРОВАНИЙ (только со статусом "Подтверждено")
const activeBookings = bookings.filter(b =>
b.userId === currentUser?.id && b.status === 'Подтверждено'
);
const canceledBookings = bookings.filter(b =>
b.userId === currentUser?.id && b.status === 'Отменено'
);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Мои Бронирования</h2>

            {/* Активные бронирования */}
            <div className="bg-white p-6 card-shadow border border-gray-100 space-y-4 mb-8">
                <h3 className="text-2xl font-semibold text-green-700 border-b pb-2">Активные ({activeBookings.length})</h3>
                {activeBookings.length > 0 ? (
                    activeBookings.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-xl bg-green-50 border-green-200 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-green-700 flex items-center">
                                    <Hotel className="w-5 h-5 mr-2" /> Отель: {booking.hotelName}
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    Номер: <span className="font-bold">{booking.roomType}</span>, с {booking.checkIn} по {booking.checkOut}.
                                </p>
                                <p className="text-sm text-green-600">Цена: {booking.price} ₽</p>
                            </div>
                            {/* КНОПКА ОТМЕНЫ БРОНИРОВАНИЯ */}
                            <button
                                onClick={() => cancelBooking(booking.id)}
                                className="text-red-600 border border-red-300 bg-white hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
                            >
                                Отменить
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-4 border rounded-xl bg-gray-50 text-gray-600">
                        <p>У вас пока нет активных бронирований.</p>
                    </div>
                )}
            </div>

            {/* Отмененные бронирования */}
            <div className="bg-white p-6 card-shadow border border-gray-100 space-y-4">
                <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2">Отмененные ({canceledBookings.length})</h3>
                {canceledBookings.length > 0 ? (
                    canceledBookings.map((booking) => (
                         <div key={booking.id} className="p-4 border rounded-xl bg-gray-100 border-gray-300 text-gray-500">
                            <p className="font-semibold flex items-center">
                                <Hotel className="w-5 h-5 mr-2" /> Отель: {booking.hotelName}
                            </p>
                            <p className="text-sm mt-1">
                                Номер: <span className="font-bold">{booking.roomType}</span>, даты: {booking.checkIn} по {booking.checkOut}.
                            </p>
                            <p className="text-sm font-bold text-red-500">Статус: {booking.status}</p>
                        </div>
                    ))
                ) : (
                    <div className="p-4 border rounded-xl bg-gray-50 text-gray-600">
                        <p>Нет отмененных бронирований.</p>
                    </div>
                )}
            </div>
        </div>
    );

};

const NotFoundPage = ({ message = 'Маршрут не найден.', navigate }) => (

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
<h2 className="text-6xl font-extrabold accent-text mb-4">404</h2>
<p className="text-2xl text-gray-700 mb-6">{message}</p>
<button onClick={() => navigate('/')} className="mt-6 inline-block py-3 px-8 rounded-lg text-white font-semibold accent-color accent-hover transition shadow-lg">
<Home className="w-5 h-5 inline mr-2 -mt-1" /> Вернуться на Главную
</button>
</div>
);

// -------------------------------------------------------------------------
// 6. Основной Компонент (Header, Footer, App)
// -------------------------------------------------------------------------

/\*\*

- Компонент верхнего навигационного меню.
  \*/
  const Header = ({ currentUser, logout, navigate }) => {
  // ОТОБРАЖЕНИЕ ИМЕНИ ЗАРЕГИСТРИРОВАННОГО ПОЛЬЗОВАТЕЛЯ
  const userName = useMemo(() => currentUser?.name || currentUser?.email || 'Профиль', [currentUser]);

                return (
                    <div className="bg-white shadow-lg sticky top-0 z-10">
                        <CustomStyles />
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                {/* Логотип */}
                                <div className="flex-shrink-0">
                                    <button onClick={() => navigate('/')} className="text-2xl font-bold accent-text hover:opacity-80">
                                        BookEZ
                                    </button>
                                </div>

                                {/* Навигация */}
                                <nav className="hidden md:flex space-x-6">
                                    <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium">
                                        Главная
                                    </button>
                                    {currentUser && (
                                        <button onClick={() => navigate('/bookings')} className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium">
                                            Мои Брони
                                        </button>
                                    )}
                                    {/* Меню Менеджера/Админа */}
                                    {currentUser?.role === 'manager' && (
                                         <button onClick={() => navigate('/manager')} className="text-amber-600 hover:text-amber-800 transition duration-150 font-bold">
                                            Панель Менеджера
                                        </button>
                                    )}
                                </nav>

                                {/* Авторизация/Профиль */}
                                <div className="flex items-center space-x-3">
                                    {currentUser ? (
                                        <div className="relative group">
                                            <button className="flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                                                <User className="h-6 w-6 accent-text" />
                                                {/* Отображение имени пользователя */}
                                                <span className="ml-2 hidden sm:inline font-semibold text-gray-700">
                                                    {userName}
                                                </span>
                                            </button>

                                            <div className="absolute right-0 mt-2 w-48 bg-white card-shadow hidden group-hover:block transition z-20 overflow-hidden">
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" /> Выход
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="px-4 py-2 text-sm rounded-full border-2 accent-border accent-text hover:bg-gray-50 transition font-semibold"
                                            >
                                                Войти
                                            </button>
                                            <button
                                                onClick={() => navigate('/register')}
                                                className="px-4 py-2 text-sm rounded-full text-white accent-color accent-hover transition hidden sm:inline font-semibold shadow-md"
                                            >
                                                Регистрация
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

    };

const Footer = () => (

<footer className="bg-gray-800 mt-12">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
<div className="md:flex md:justify-between">
<div className="mb-6 md:mb-0">
<p className="text-2xl font-bold accent-text">BookEZ</p>
<p className="text-sm text-gray-400 mt-2">Ваш надёжный сервис бронирования отелей.</p>
</div>
<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
<div>
<h3 className="text-sm font-semibold text-gray-100 uppercase mb-4">Навигация</h3>
<ul className="text-gray-400 space-y-2">
<li><a href="#/" className="hover:text-white transition">Главная</a></li>
<li><a href="#/bookings" className="hover:text-white transition">Мои Брони</a></li>
</ul>
</div>
</div>
</div>
<hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
<div className="text-center">
<span className="text-sm text-gray-400 sm:text-center">© 2024 BookEZ. Все права защищены.</span>
</div>
</div>
</footer>
);

/\*\*

- Основной компонент SPA-приложения.
  \*/
  export default function App() {
  // 1. Имитация глобального состояния пользователя
  const [currentUser, setCurrentUser] = useState(null);

                // ИМИТАЦИЯ СОСТОЯНИЯ БРОНИРОВАНИЙ
                const [bookings, setBookings] = useState([
                    { id: 1, userId: 'user-123', hotelName: 'Москва Гранд Отель', roomType: 'Люкс с Видом', checkIn: '2025-12-15', checkOut: '2025-12-20', price: 15000, status: 'Подтверждено' },
                    { id: 2, userId: 'user-123', hotelName: 'Отель у Парка', roomType: 'Стандартный Двухместный', checkIn: '2025-11-25', checkOut: '2025-11-28', price: 5200, status: 'Подтверждено' },
                    { id: 3, userId: 'user-456', hotelName: 'Солнечный Берег', roomType: 'Эконом', checkIn: '2026-01-10', checkOut: '2026-01-15', price: 4500, status: 'Подтверждено' },
                ]);

                // 2. Роутинг на основе хэша
                const { route, params, navigate } = useHashRouter();

                // 3. Имитация авторизации и выхода
                const login = (userData) => {
                    // Имитируем успешный вход с данными из формы
                    setCurrentUser({
                        id: 'user-123',
                        email: userData.email,
                        name: userData.name || userData.email.split('@')[0],
                        role: 'user'
                    });
                    alert(`Вы успешно вошли в систему как ${userData.name || userData.email.split('@')[0]}!`);
                    navigate('/');
                };

                const register = (userData) => {
                    console.log("Registered user:", userData);
                    alert(`Регистрация пользователя ${userData.name} прошла успешно! Теперь войдите.`);
                    navigate('/login');
                };

                const logout = (e) => {
                    e.preventDefault();
                    setCurrentUser(null);
                    alert('Вы вышли из системы.');
                    navigate('/');
                };

                const addBooking = (newBooking) => {
                    setBookings(prev => [
                        ...prev,
                        {
                            ...newBooking,
                            id: Date.now(),
                            userId: currentUser.id,
                            status: 'Подтверждено'
                        }
                    ]);
                };

                // ФУНКЦИЯ ОТМЕНЫ БРОНИРОВАНИЯ
                const cancelBooking = (bookingId) => {
                    setBookings(prev =>
                        prev.map(b =>
                            b.id === bookingId && b.userId === currentUser.id
                            ? { ...b, status: 'Отменено', cancelledAt: getMinDate() }
                            : b
                        )
                    );
                    alert(`Бронирование #${bookingId} отменено.`);
                };

                // 4. Определение содержимого страницы
                let content;
                const isUserLoggedIn = !!currentUser;
                const isManager = currentUser?.role === 'manager';

                if (route === '/') {
                    content = <HomePage navigate={navigate} />;
                } else if (route === 'login') {
                    content = <LoginPage login={login} navigate={navigate} />;
                } else if (route === 'register') {
                    // Передача функции регистрации
                    content = <RegisterPage navigate={navigate} register={register} />;
                } else if (route === 'bookings') {
                    // Передача функции отмены бронирования
                    content = isUserLoggedIn ? <BookingsPage navigate={navigate} currentUser={currentUser} bookings={bookings} cancelBooking={cancelBooking} /> : <NotFoundPage navigate={navigate} message="Доступ только для авторизованных пользователей." />;
                } else if (route === 'cityDetails') {
                    content = <CityDetailsPage params={params} navigate={navigate} />;
                } else if (route === 'hotelDetails') {
                    content = <HotelDetailsPage params={params} navigate={navigate} />;
                } else if (route === 'roomBooking') {
                    content = <RoomBookingPage
                        params={params}
                        navigate={navigate}
                        currentUser={currentUser}
                        bookings={bookings}
                        addBooking={addBooking}
                    />;
                } else if (route === 'manager') {
                    content = isManager ? <NotFoundPage navigate={navigate} message="Панель менеджера (скоро здесь будет функционал управления)." /> : <NotFoundPage navigate={navigate} message="У вас нет прав доступа к этой странице." />;
                } else {
                    content = <NotFoundPage navigate={navigate} />;
                }

                return (
                    <div className="min-h-screen flex flex-col">
                        <Header currentUser={currentUser} logout={logout} navigate={navigate} />
                        <div className="flex-grow">
                            {content}
                        </div>
                        <Footer />
                    </div>
                );

    }
