import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  fetchDoubtById,
  fetchRepliesByDoubtId,
} from '../../features/doubtSlice';

import { Loader, DoubtDetailsHeader, ReplyForm, ReplyList } from '../ComponentImport';

const DoubtThreadView = () => {
  const { doubtId } = useParams();
  const dispatch = useDispatch();
  const { selectedDoubt, loading, repliesByDoubt } = useSelector(
    (state) => state.doubt
  );

  useEffect(() => {
    if (doubtId) {
      dispatch(fetchDoubtById(doubtId));
      dispatch(fetchRepliesByDoubtId(doubtId));
    }
  }, [doubtId, dispatch]);

  if (loading || !selectedDoubt) return <Loader />;

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 bg-zinc-900 rounded-md">
      <DoubtDetailsHeader doubt={selectedDoubt} />

      <ReplyForm doubtId={doubtId} />

      <ReplyList replies={repliesByDoubt[doubtId] || []} doubtId={doubtId} />
    </div>
  );
};

export default DoubtThreadView;
