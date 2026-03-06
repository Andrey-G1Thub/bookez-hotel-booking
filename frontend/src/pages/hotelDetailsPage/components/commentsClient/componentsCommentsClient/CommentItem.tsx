import { Trash2 } from 'lucide-react';
import type { CommentItemProps } from '../../../../../types/components';
// import type { CommentItemProps } from '../../../../types/components';

export const CommentItem = ({ comment, canDelete, onDelete }: CommentItemProps) => (
	<div className="bg-white p-6 rounded-2xl shadow-sm border hover:border-[#00a3a8]/30 transition-colors flex justify-between gap-4">
		<div className="flex-1">
			<div className="flex items-center gap-3 mb-3">
				<div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-[#00a3a8] font-bold">
					{comment.userName?.[0]?.toUpperCase() || '?'}
				</div>
				<div>
					<p className="font-bold text-gray-800 leading-none mb-1">
						{comment.userName}
					</p>
					<p className="text-xs text-gray-400">{comment.date}</p>
				</div>
			</div>
			<p className="text-gray-600 leading-relaxed">{comment.text}</p>
		</div>
		{canDelete && (
			<button
				onClick={() => onDelete(comment._id)}
				className="text-gray-300 hover:text-red-500 transition-colors self-start p-2"
				title="Удалить отзыв"
			>
				<Trash2 className="w-5 h-5" />
			</button>
		)}
	</div>
);
