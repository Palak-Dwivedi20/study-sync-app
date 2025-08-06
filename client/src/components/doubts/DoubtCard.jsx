import React from 'react';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { FaComments } from 'react-icons/fa';

const DoubtCard = ({ doubt }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl w-full mx-auto bg-zinc-900 border rounded-xl p-4 shadow-sm mb-4">
      <p className="text-white font-medium text-md mb-2">
        {doubt.description}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Asked by: <strong className='text-yellow-200'>{doubt.askedBy?.username || 'Unknown'}</strong>
        </span>
        <span>
          {formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={() => navigate(`/doubts/${doubt._id}`)}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FaComments /> View Replies
        </button>
      </div>
    </div>
  );
};

export default DoubtCard;
