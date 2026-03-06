import type { RatingProps } from '../../types/components';

export const Rating = ({ rating }: RatingProps) => (
	<div className="flex items-center text-sm font-semibold text-yellow-500">
		{[...Array(5)].map((_, i) => (
			<span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
				★
			</span>
		))}
	</div>
);
