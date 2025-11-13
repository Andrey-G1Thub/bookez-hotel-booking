import './App.css';

// Определите getMinDate, чтобы избежать ошибки "not defined"
const getMinDate = () => {
	// В реальном приложении эта функция должна возвращать дату в формате YYYY-MM-DD
	const today = new Date();
	return today.toISOString().split('T')[0];
};

export const App = () => {
	return (
		<div>
			<div
				className="relative h-96 bg-cover bg-center"
				// ИСПРАВЛЕНИЕ 1: Использование JS-объекта для стиля
				style={{
					backgroundImage:
						"url('https://placehold.co/1600x600/00A3A8/ffffff?text=Найдите+Ваш+Идеальный+Номер')",
				}}
			>
				<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
					<div className="w-full max-w-4xl p-4 md:p-8">
						<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
							Бронируйте с Доверием
						</h1>

						{/* ИСПРАВЛЕНИЕ 2: Использование JSX-комментария */}
						{/* Модуль Поиска */}

						<form
							id="search-form"
							className="bg-white p-4 md:p-6 rounded-xl card-shadow flex flex-col md:flex-row gap-3"
						>
							<input
								type="text"
								placeholder="Город/Направление"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 accent-text focus:accent-border"
								required
							/>

							{/* ИСПРАВЛЕНИЕ 3: Использование фигурных скобок для JS-выражения */}
							<input
								type="date"
								placeholder="Дата Заезда"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 accent-text focus:accent-border"
								min={getMinDate()}
								required
							/>

							{/* ИСПРАВЛЕНИЕ 3: Использование фигурных скобок для JS-выражения */}
							<input
								type="date"
								placeholder="Дата Выезда"
								className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 accent-text focus:accent-border"
								min={getMinDate()}
								required
							/>

							<button
								type="submit"
								className="px-6 py-3 rounded-lg text-white font-semibold accent-color accent-hover transition"
							>
								Найти
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
