import { Hotel as HotelIcon } from 'lucide-react';
import { DashboardHeader } from './componentsManagerPage/Header';
import { HotelCardInManagerPage } from './componentsManagerPage/HotelCardInManagerPage';
import { ItemInCardManager } from './componentsManagerPage/componentsHotelCardInManagerPage/ItemInCardManager';
import { HotelModal } from './componentsManagerPage/componentModalForm/HotelModal';
import { RoomModal } from './componentsManagerPage/componentModalForm/RoomModal';

import { useManagerLogic } from './hooks/useManagerLogic';
import type { Hotel } from '../../types/models';

export const ManagerPage = () => {
	const { state, actions } = useManagerLogic();

	return (
		<div className="p-6 max-w-7xl mx-auto mt-10">
			{/* HEADER */}
			<DashboardHeader
				isAdmin={state.isAdmin}
				currentUser={state.currentUser}
				myHotels={state.myHotels}
				canAddHotel={state.canAddHotel}
				setIsModalOpen={actions.setIsModalOpen}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					<h2 className="text-xl font-semibold flex items-center gap-2 ml-2">
						<HotelIcon className="text-teal-600" /> Мои объекты
					</h2>

					{state.myHotels.map((hotel: Hotel) => (
						<div
							key={hotel._id}
							className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
						>
							{/* Мои обьекты */}
							<HotelCardInManagerPage
								hotel={hotel}
								cities={state.cities}
								handleOpenAddRoomModal={actions.handleOpenAddRoomModal}
								setSelectedHotel={actions.setSelectedHotel}
								handleDeleteHotel={actions.handleDeleteHotel}
								handleEditHotelClick={actions.handleEditHotelClick}
							/>
							{/* СПИСОК НОМЕРОВ ВНУТРИ КАРТОЧКИ */}
							<ItemInCardManager
								hotel={hotel}
								handleDeleteRoom={actions.handleDeleteRoom}
								allBookings={state.enrichedBookings}
								handleEditRoomClick={actions.handleEditRoomClick}
								handleDeleteBooking={actions.handleDeleteBooking}
							/>
						</div>
					))}
				</div>
			</div>

			{/* MODAL FORM добавления отеля*/}

			<HotelModal
				newHotel={state.newHotel}
				setNewHotel={actions.setNewHotel}
				cities={state.cities}
				isModalOpen={state.isModalOpen}
				setIsModalOpen={actions.setIsModalOpen}
				handleSaveHotel={actions.handleSaveHotel}
				isEditMode={state.isEditMode}
				handleRemovePhoto={(url) => actions.handleRemovePhoto('hotel', url)}
			/>
			{/* Модалка добавления номера */}

			<RoomModal
				isRoomModalOpen={state.isRoomModalOpen}
				setIsRoomModalOpen={actions.setIsRoomModalOpen}
				selectedHotel={state.selectedHotel}
				handleAddRoom={actions.handleAddRoom}
				newRoom={state.newRoom}
				setNewRoom={actions.setNewRoom}
				photoUrl={state.photoUrl}
				setPhotoUrl={actions.setPhotoUrl}
				handleRemovePhoto={actions.handleRemovePhoto}
				isEditMode={state.isEditMode}
			/>
		</div>
	);
};
