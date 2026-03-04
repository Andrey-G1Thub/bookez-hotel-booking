import { X } from 'lucide-react';
import { getFullImageUrl } from '../../../../../utils/getFullImageUrl';
// import { getFullImageUrl } from '../../../../utils/getFullImageUrl';

interface PhotoPreviewProps {
	src: string | File;
	onRemove: () => void;
	isPrimary?: boolean;
}

export const PhotoPreview = ({ src, onRemove, isPrimary }: PhotoPreviewProps) => {
	// Определяем URL для отображения
	const displayUrl =
		typeof src === 'string' ? getFullImageUrl(src) : URL.createObjectURL(src);

	return (
		<div className={`relative w-20 h-20 group`}>
			<img
				src={displayUrl}
				alt="Preview"
				className={`w-full h-full rounded-lg object-cover border ${
					isPrimary ? 'border-2 border-teal-500' : 'border-gray-100'
				}`}
				onError={(e) => {
					e.currentTarget.src = 'https://placehold.co/100x100?text=Error';
				}}
			/>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					onRemove();
				}}
				className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1
                           shadow-md hover:bg-red-600 transition-transform scale-90
                           group-hover:scale-110"
			>
				<X size={12} />
			</button>
		</div>
	);
};
