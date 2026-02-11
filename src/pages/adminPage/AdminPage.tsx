import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersThunk, updateUserRoleThunk } from '../../store/actions/userActions';
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
								<td className="p-4 text-sm">
									{user.role === ROLES.MANAGER ? (
										<span>
											{user.limits?.maxHotels || 1} /{' '}
											{user.limits?.maxRooms || 5}
										</span>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
