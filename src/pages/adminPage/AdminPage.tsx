import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteUserThunk,
	fetchAllUsersThunk,
	updateUserRoleThunk,
} from '../../store/actions/userActions';
import { ROLES } from '../../utils/permissions';
// import { ROLES } from '../../utils/roles'; //

export const AdminPage = () => {
	const dispatch = useDispatch();
	// сохраняю список всех юзеров в users.usersList
	const { usersList, currentUser } = useSelector((state: any) => state.users);

	useEffect(() => {
		dispatch(fetchAllUsersThunk());
	}, [dispatch]);

	const handleRoleChange = (userId: number, newRole: string) => {
		// При смене на менеджера можно сразу задать дефолтные лимиты
		const defaultLimits =
			newRole === ROLES.MANAGER ? { maxHotels: 1, maxRooms: 5 } : null;
		dispatch(updateUserRoleThunk(userId, newRole, defaultLimits));
	};

	// НОВАЯ ФУНКЦИЯ: Изменение конкретного лимита
	const handleLimitChange = (
		userId: number,
		currentRole: string,
		field: string,
		value: string,
	) => {
		const user = usersList.find((u: any) => u.id === userId);
		if (!user) return;

		const newLimits = {
			...user.limits,
			[field]: parseInt(value) || 0,
		};

		dispatch(updateUserRoleThunk(userId, currentRole, newLimits));
	};

	// НОВАЯ ФУНКЦИЯ УДАЛЕНИЯ
	const handleDeleteUser = (userId: number, userName: string) => {
		if (window.confirm(`Вы уверены, что хотите удалить пользователя ${userName}?`)) {
			dispatch(deleteUserThunk(userId));
		}
	};

	return (
		<div className="p-8 mt-10">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">
				Управление пользователями
			</h1>

			<div className="overflow-x-auto bg-white rounded-lg shadow">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-100 border-b">
							<th className="p-4 font-semibold text-gray-700">Имя</th>
							<th className="p-4 font-semibold text-gray-700">Email</th>
							<th className="p-4 font-semibold text-gray-700">
								Текущая роль
							</th>
							<th className="p-4 font-semibold text-gray-700">
								Изменить роль
							</th>
							<th className="p-4 font-semibold text-gray-700">
								Лимиты (H/R)
							</th>
						</tr>
					</thead>
					<tbody>
						{usersList?.map((user: any) => (
							<tr
								key={user.id}
								className="border-b hover:bg-gray-50 transition"
							>
								<td className="p-4">{user.name}</td>
								<td className="p-4 text-gray-600">{user.email}</td>
								<td className="p-4">
									<span
										className={`px-2 py-1 rounded text-xs font-bold uppercase ${
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
										disabled={user.id === currentUser?.id} // Не даем админу случайно снять роль с самого себя
										onChange={(e) =>
											handleRoleChange(user.id, e.target.value)
										}
										className="border rounded p-1 outline-none focus:ring-2 focus:ring-teal-500"
									>
										<option value={ROLES.USER}>User</option>
										<option value={ROLES.MANAGER}>Manager</option>
										<option value={ROLES.ADMIN}>Admin</option>
									</select>
								</td>
								<td className="p-4">
									{user.role === ROLES.MANAGER ? (
										<div className="flex items-center justify-center gap-2">
											<div className="flex flex-col items-center">
												<span className="text-[10px] text-gray-400 uppercase">
													Отели
												</span>
												<input
													type="number"
													min="1"
													value={user.limits?.maxHotels || 1}
													onChange={(e) =>
														handleLimitChange(
															user.id,
															user.role,
															'maxHotels',
															e.target.value,
														)
													}
													className="w-16 border rounded p-1 text-center font-bold text-blue-600"
												/>
											</div>
											<span className="text-gray-300 mt-4">/</span>
											<div className="flex flex-col items-center">
												<span className="text-[10px] text-gray-400 uppercase">
													Номера
												</span>
												<input
													type="number"
													min="1"
													value={user.limits?.maxRooms || 5}
													onChange={(e) =>
														handleLimitChange(
															user.id,
															user.role,
															'maxRooms',
															e.target.value,
														)
													}
													className="w-16 border rounded p-1 text-center font-bold text-teal-600"
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
											handleDeleteUser(user.id, user.name)
										}
										disabled={user.id === currentUser?.id} // Себя удалять нельзя
										className={`px-3 py-1 rounded text-white transition ${
											user.id === currentUser?.id
												? 'bg-gray-300 cursor-not-allowed'
												: 'bg-red-500 hover:bg-red-600'
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
