import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postReply } from '../../features/doubtSlice';
import { Button, Input } from '../ComponentImport';
import { toast } from 'react-toastify';
import { IoMdSend } from "react-icons/io";

const ReplyInput = ({ doubtId, parentReplyId = null, onClose }) => {
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

            // await dispatch(fetchRepliesByDoubtId(doubtId)).unwrap();

            if (onClose) onClose();
        } catch (err) {
            toast.error(err?.message || 'Reply failed');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="mt-4 text-white relative">
            <Input
                className="w-full p-2"
                rows="2"
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
            />

            <button
                disabled={posting || !replyText.trim()}
                onClick={handleSubmit}
                className='p-2 bg-blue-800 hover:bg-blue-900 duration-300 rounded-full absolute right-2 top-2 cursor-pointer'
            >
                <IoMdSend />
            </button>
        </div>
    );
};

export default ReplyInput;
