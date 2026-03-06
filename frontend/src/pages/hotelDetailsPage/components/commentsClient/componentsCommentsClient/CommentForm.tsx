import { Send } from 'lucide-react';
import type { CommentFormProps } from '../../../../../types/components';

export const CommentForm = ({ onSubmit }: CommentFormProps) => (
	<form
		onSubmit={onSubmit}
		className="mb-12 bg-teal-50/30 p-8 rounded-2xl border border-teal-100"
	>
		<label className="block text-gray-800 font-bold mb-3">Ваш отзыв</label>
		<div className="flex flex-col sm:flex-row gap-4">
			<textarea
				name="comment"
				required
				className="flex-1 p-4 border rounded-xl focus:ring-2 focus:ring-[#00a3a8] outline-none min-h-[100px] resize-none"
				placeholder="Расскажите о вашем отдыхе..."
			/>
			<button
				type="submit"
				className="sm:self-end p-5 bg-[#00a3a8] text-white rounded-xl hover:bg-[#008c91] transition shadow-md"
			>
				<Send className="w-6 h-6" />
			</button>
		</div>
	</form>
);
