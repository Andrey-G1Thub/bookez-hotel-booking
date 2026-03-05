import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	deleteUserThunk,
	fetchAllUsersThunk,
	updateUserRoleThunk,
} from '../../store/actions/userActions';
import { checkPermission, ROLES } from '../../utils/permissions';
import type { AppDispatch } from '../../store';
import { selectCurrentUser, selectUsersList } from '../../selectors';
import { useAppSelector } from '../../store/hooks';
import type { User, UserLimits } from '../../types/models';
// import type { User, UserLimits } from '../../store/reducers/userReducer';

export const AdminPage = () => {
	const dispatch = useDispatch<AppDispatch>();

	const currentUser = useAppSelector(selectCurrentUser);
	const usersList = useAppSelector(selectUsersList);

	const canManageUsers = checkPermission(currentUser, 'ADMIN_USERS');
	const canViewList = checkPermission(currentUser, 'VIEW_USERS_LIST');

	useEffect(() => {
		dispatch(fetchAllUsersThunk());
	}, [dispatch]);

	const handleRoleChange = (userId: string, newRole: string) => {
		if (!canManageUsers) return;
		const defaultLimits =
			newRole === ROLES.MANAGER ? { maxHotels: 1, maxRooms: 5 } : null;
		dispatch(updateUserRoleThunk(userId, newRole, defaultLimits));
	};

	//Изменение конкретного лимита
	const handleLimitChange = (
		userId: string,
		currentRole: string,
		field: keyof UserLimits,
		value: string,
	) => {
		if (!canManageUsers) return;
		const user = usersList.find((u: User) => u._id === userId);
		if (!user) return;

		const newLimits: UserLimits = {
			maxHotels: user.limits?.maxHotels || 1,
			maxRooms: user.limits?.maxRooms || 5,
			[field]: parseInt(value) || 0,
		};

		dispatch(updateUserRoleThunk(userId, currentRole, newLimits));
	};

	// УДАЛЕНИЯ
	const handleDeleteUser = (userId: string, userName: string) => {
		if (!canManageUsers) {
			alert('У вас недостаточно прав');
			return;
		}

		if (window.confirm(`Вы уверены, что хотите удалить пользователя ${userName}?`)) {
			dispatch(deleteUserThunk(userId));
		}
	};
	if (!canViewList) {
		return <div className="p-8 text-center text-red-500">Доступ запрещен</div>;
	}

	return (
		<div className="p-8 mt-10 max-w-7xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">
				Управление пользователями
			</h1>

			<div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-50 border-b">
							<th className="p-4 font-semibold text-gray-600">Имя</th>
							<th className="p-4 font-semibold text-gray-600">Email</th>
							<th className="p-4 font-semibold text-gray-600">Роль</th>
							<th className="p-4 font-semibold text-gray-600">
								Изменить роль
							</th>
							<th className="p-4 font-semibold text-gray-600 text-center">
								Лимиты (H/R)
							</th>
							<th className="p-4 font-semibold text-gray-600">Действия</th>
						</tr>
					</thead>
					<tbody>
						{usersList?.map((user: User) => (
							<tr
								key={user._id}
								className="border-b hover:bg-gray-50/50 transition"
							>
								<td className="p-4 font-medium">{user.name}</td>
								<td className="p-4 text-gray-600">{user.email}</td>
								<td className="p-4">
									<span
										className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
											user.role === 'admin'
												? 'bg-red-100 text-red-700'
												: user.role === 'manager'
													? 'bg-blue-100 text-blue-700'
													: 'bg-green-100 text-green-700'
										}`}
									>
										{user.role}
									</span>
								</td>
								<td className="p-4">
									<select
										value={user.role}
										// Блокируем, если нельзя управлять юзерами ИЛИ это сам текущий юзер
										disabled={
											!canManageUsers ||
											user._id === currentUser?._id
										}
										onChange={(e) =>
											handleRoleChange(user._id, e.target.value)
										}
										className="border rounded p-1 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
									>
										<option value={ROLES.USER}>User</option>
										<option value={ROLES.MANAGER}>Manager</option>
										<option value={ROLES.ADMIN}>Admin</option>
									</select>
								</td>
								<td className="p-4">
									{user.role === ROLES.MANAGER ? (
										<div className="flex items-center justify-center gap-3">
											<div className="flex flex-col items-center">
												<input
													type="number"
													min="1"
													disabled={!canManageUsers} // Добавлена защита лимитов
													value={user.limits?.maxHotels || 1}
													onChange={(e) =>
														handleLimitChange(
															user._id,
															user.role,
															'maxHotels',
															e.target.value,
														)
													}
													className="w-12 border rounded p-1 text-center text-xs font-bold text-blue-600 disabled:opacity-50"
												/>
											</div>
											<span className="text-gray-300">/</span>
											<div className="flex flex-col items-center">
												<input
													type="number"
													min="1"
													disabled={!canManageUsers} // Добавлена защита лимитов
													value={user.limits?.maxRooms || 5}
													onChange={(e) =>
														handleLimitChange(
															user._id,
															user.role,
															'maxRooms',
															e.target.value,
														)
													}
													className="w-12 border rounded p-1 text-center text-xs font-bold text-teal-600 disabled:opacity-50"
												/>
											</div>
										</div>
									) : (
										<div className="text-center text-gray-300">—</div>
									)}
								</td>
								<td className="p-4">
									<button
										onClick={() =>
											handleDeleteUser(user._id, user.name)
										}
										disabled={
											!canManageUsers ||
											user._id === currentUser?._id
										}
										className={`px-3 py-1.5 rounded text-xs font-medium transition ${
											!canManageUsers ||
											user._id === currentUser?._id
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
										}`}
									>
										Удалить
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
