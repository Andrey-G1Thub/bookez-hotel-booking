import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../selectors';
import type { PrivateRouteProps } from '../types/models';

export const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
	const currentUser = useAppSelector(selectCurrentUser);
	const location = useLocation();

	if (!currentUser) {
		//  путь, куда  хотел попасть, пользователь  после логина
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	// ограничение по ролям (например, только менеджер)
	if (roles && !roles.includes(currentUser.role)) {
		return <Navigate to="/" replace />;
	}
	return children;
};
