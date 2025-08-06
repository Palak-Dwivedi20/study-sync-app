import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { toggleReplyLike } from '../../features/doubtSlice';
import { FaHeart, FaRegHeart, FaReply, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ReplyInput } from '../ComponentImport';
import { useClickOutside } from '../../hooks/useClickOutside'

const ReplyBox = ({ reply, doubtId, showToggle = false, onToggle, showChildren }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [likes, setLikes] = useState(reply.likes || []);
  const [hasLiked, setHasLiked] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const replyInputRef = useRef(null);

  useClickOutside(replyInputRef, () => {
    if (showReplyInput) {
      setShowReplyInput(false);
    }
  });

  useEffect(() => {
    setLikes(reply.likes || []);
    setHasLiked(reply.likes.includes(userId));
  }, [reply.likes, userId]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev.filter((id) => id !== userId));
    } else {
      setLikes((prev) => [...prev, userId]);
      setShowPop(true);
      setTimeout(() => setShowPop(false), 500);
    }
    setHasLiked(!hasLiked);
    dispatch(toggleReplyLike({ replyId: reply._id }));
  };

  return (
    <div className="border-b border-gray-700 p-2">
      <p className="text-white">{reply.replyText}</p>

      <div className="flex justify-between items-center text-sm text-gray-500 my-3">
        <span>
          Replied by <strong className='text-yellow-200'>{reply.repliedBy?.username || 'Unknown'}</strong> •{' '}
          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
        </span>

        <div className="flex items-center gap-4">

          {/* Like */}
          <span
            className="relative flex items-center gap-1 cursor-pointer"
            onClick={handleLike}
          >
            <div className="w-5 h-5 relative flex items-center justify-center">
              <AnimatePresence>
                {showPop ? (
                  <motion.span
                    key="pop-heart"
                    className="absolute"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaHeart className="text-red-500 text-lg" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="static-heart"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {hasLiked ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-red-500 text-lg" />
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <span className='w-3'>{likes.length}</span>
          </span>

          {/* Reply */}
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <FaReply /> Reply
          </button>
        </div>
      </div>

      {/* ▼ Show # replies */}
      {showToggle && (
        <button
          onClick={onToggle}
          className="text-sm text-blue-600 flex items-center cursor-pointer"
        >
          {showChildren ? '▼' : '▶'} {reply.children.length} Replies
        </button>
      )}

      {showReplyInput && (
        <div
          className="my-4"
          ref={replyInputRef}
        >
          <ReplyInput
            doubtId={doubtId}
            parentReplyId={reply._id}
            onClose={() => setShowReplyInput(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ReplyBox;
