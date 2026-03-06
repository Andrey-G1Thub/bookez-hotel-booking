import type { LoadingSpinnerProps } from '../../types/components';

export const LoadingSpinner = ({
	message = 'Загрузка данных...',
}: LoadingSpinnerProps) => (
	<div className="flex justify-center items-center p-10">
		<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00a3a8]"></div>
		{message && <p className="text-[#00a3a8] font-medium animate-pulse">{message}</p>}
	</div>
);
