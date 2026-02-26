interface LoadingSpinnerProps {
	message?: string;
}

export const LoadingSpinner = ({
	message = 'Загрузка данных...',
}: LoadingSpinnerProps) => (
	<div className="flex justify-center items-center p-10">
		<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00a3a8]">
			{message}
		</div>
	</div>
);
