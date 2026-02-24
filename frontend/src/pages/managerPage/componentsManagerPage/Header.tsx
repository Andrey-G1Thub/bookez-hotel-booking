import { PlusCircle } from 'lucide-react';
import type { User } from '../../../store/reducers/userReducer';
import type { Hotel } from '../../../store/reducers/hotelReducer';

interface DashboardHeaderProps {
	isAdmin: boolean;
	currentUser: User | null;
	myHotels: Hotel[];
	canAddHotel: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
}

export const DashboardHeader = ({
	isAdmin,
	currentUser,
	myHotels,
	canAddHotel,
	setIsModalOpen,
}: DashboardHeaderProps) => (
	<header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
		<div>
			<h1 className="text-3xl font-bold text-gray-800">Панель управления</h1>
			<p className="text-gray-500 font-medium">
				{isAdmin ? 'Режим Администратора' : `Менеджер: ${currentUser?.name}`}
			</p>
		</div>

		{canAddHotel ? (
			<button
				onClick={() => setIsModalOpen(true)}
				className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
			>
				<PlusCircle size={20} />
				Добавить отель
			</button>
		) : (
			<div className="text-sm bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-200">
				Лимит отелей исчерпан ({myHotels.length}/{currentUser?.limits?.maxHotels})
			</div>
		)}
	</header>
);
