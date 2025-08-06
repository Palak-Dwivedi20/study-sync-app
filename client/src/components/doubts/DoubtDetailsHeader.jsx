import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const DoubtDetailsHeader = ({ doubt }) => {
  return (
    <div className="bg-zinc-900 text-white border border-gray-700 rounded-md p-4 shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">{doubt.description}</h2>
      <p className="text-sm text-gray-500">
        Asked by <strong className='text-yellow-200'>{doubt.askedBy?.username}</strong> •{' '}
        {formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}
      </p>
    </div>
  );
};

export default DoubtDetailsHeader;
