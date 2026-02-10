import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children, roles }) => {
	const currentUser = useSelector((state) => state.users.currentUser);
	const location = useLocation();

	// 1. Если пользователь вообще не вошел
	if (!currentUser) {
		// Сохраняем путь, куда он хотел попасть, чтобы вернуть его туда после логина
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// 2. Если у маршрута есть ограничение по ролям (например, только менеджер)
	if (roles && !roles.includes(currentUser.role)) {
		return <Navigate to="/" replace />;
	}

	// 3. Если всё хорошо, показываем защищенную страницу
	return children;
};
