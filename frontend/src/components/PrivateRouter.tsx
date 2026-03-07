import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../selectors';
import type { PrivateRouteProps } from '../types/components';
import { ROUTES } from './constants/route';

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
	const currentUser = useAppSelector(selectCurrentUser);
	const location = useLocation();

	if (!currentUser) {
		//  путь, куда  хотел попасть, пользователь  после логина
		return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
	}
	// ограничение по ролям (например, только менеджер)
	if (roles && !roles.includes(currentUser.role)) {
		return <Navigate to="/" replace />;
	}
	return children;
};
