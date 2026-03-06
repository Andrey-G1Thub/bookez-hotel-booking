import { Skeleton } from './Skeleton';

export const WeatherSkeleton = () => (
	<div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-2xl border border-gray-100">
		<div className="flex flex-col items-end gap-1">
			<Skeleton className="w-12 h-3" />
			<Skeleton className="w-8 h-4" />
		</div>
		<div className="h-8 w-[1px] bg-gray-200"></div>
		<div className="flex flex-col gap-1">
			<Skeleton className="w-16 h-3" />
			<Skeleton className="w-14 h-3" />
		</div>
		<Skeleton className="w-6 h-6 rounded-full ml-1" />
	</div>
);
