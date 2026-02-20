import { Skeleton } from './Skeleton';

export const BookingSkeleton = () => (
	<div className="max-w-4xl mx-auto px-4 py-12">
		{/* Скелетон заголовка */}
		<Skeleton className="h-10 w-3/4 mb-4" />
		<Skeleton className="h-6 w-1/2 mb-8" />

		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			{/* Левая колонка */}
			<div className="space-y-4">
				<Skeleton className="h-48 w-full rounded-xl" />
				<Skeleton className="h-8 w-1/3" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
			</div>
			{/* Правая колонка */}
			<div className="p-6 border rounded-xl space-y-4">
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	</div>
);
