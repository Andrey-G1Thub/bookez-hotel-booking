import { MessageSquare, Star } from 'lucide-react';
import { CommentForm, CommentItem } from './componentsCommentsClient';
import type { CommentsClientProps } from '../../../../types/components';

export const CommentsClient = ({
	commentsRef,
	comments,
	canAddComment,
	handleAddComment,
	canDeleteComment,
	handleDeleteComment,
}: CommentsClientProps) => (
	<section id="comments" ref={commentsRef} className="pt-10 border-t">
		<h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
			<MessageSquare className="mr-3 text-[#00a3a8]" />
			Отзывы гостей ({comments.length})
		</h2>
		{canAddComment ? (
			<CommentForm onSubmit={handleAddComment} />
		) : (
			<div className="bg-amber-50 p-5 rounded-xl mb-10 text-amber-800 border border-amber-100 flex items-center">
				<Star className="w-5 h-5 mr-3" />
				Войдите в систему, чтобы оставить свой отзыв.
			</div>
		)}
		<div className="space-y-6">
			{comments.length > 0 ? (
				[...comments].reverse().map((c) => (
					<CommentItem // <-- ВНЕДРИЛИ
						key={c._id}
						comment={c}
						canDelete={canDeleteComment(c)}
						onDelete={handleDeleteComment}
					/>
				))
			) : (
				<p className="text-center text-gray-400 py-10 italic">
					Здесь пока пусто. Станьте первым, кто напишет отзыв!
				</p>
			)}
		</div>
	</section>
);
