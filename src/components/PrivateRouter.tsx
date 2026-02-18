import type { JSX } from 'react';
// import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../selectors';
// import { useAppSelector } from '../store/hooks';

interface PrivateRouteProps {
	children: JSX.Element;
	roles?: string[];
}

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
	const currentUser = useAppSelector(selectCurrentUser);
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
	return children;
};
