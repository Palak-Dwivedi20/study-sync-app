import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postDoubt } from '../../features/doubtSlice';
import { Button, Textarea } from '../ComponentImport';
import { toast } from 'react-toastify';

const DoubtForm = () => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;

    try {
      setPosting(true);
      await dispatch(postDoubt(description.trim())).unwrap();
      toast.success('Doubt posted!');
      setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post doubt');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-zinc-900 text-blue-100 rounded-xl shadow p-4 mb-6">
      <h1 className='font-semibold mb-2 text-white'>Ask a New Question</h1>
      <Textarea
        className="w-full p-3 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-gray-500"
        rows="3"
        placeholder="Ask your doubt here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex justify-end mt-3">
        <Button
          title={posting ? 'Posting...' : 'Post'}
          disabled={posting || !description.trim()}
          onClick={handleSubmit}
          className="bg-blue-700 text-white px-5 py-1 rounded hover:bg-blue-800"
        />
      </div>
    </div>
  );
};

export default DoubtForm;
