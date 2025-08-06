import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postReply, fetchRepliesByDoubtId } from '../../features/doubtSlice';
import { Button, Textarea } from '../ComponentImport';
import { toast } from 'react-toastify';

const ReplyForm = ({ doubtId, parentReplyId = null, onClose }) => {
  const dispatch = useDispatch();
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) return;

    try {
      setPosting(true);

      // Post reply
      const res = await dispatch(
        postReply({
          doubtId,
          replyText,
          ...(parentReplyId && { parentReplyId }),
        })
      ).unwrap();

      toast.success('Reply posted');

      // Clear text
      setReplyText('');

      await dispatch(fetchRepliesByDoubtId(doubtId)).unwrap();

      if (onClose) onClose();
    } catch (err) {
      toast.error(err?.message || 'Reply failed');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-4 text-white">
      <Textarea
        className="w-full p-2 border border-gray-700 resize-none"
        rows="2"
        placeholder="Write your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />

      <div className="flex justify-end mt-3">
        <Button
          title={posting ? 'Posting...' : 'Post Reply'}
          disabled={posting || !replyText.trim()}
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        />
      </div>
    </div>
  );
};

export default ReplyForm;
