import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoubts } from '../../features/doubtSlice';
import { DoubtCard, Loader } from '../ComponentImport'; // optional, use your existing loader


const DoubtList = () => {
    const dispatch = useDispatch();
    const { allDoubts, loading } = useSelector(state => state.doubt);

    useEffect(() => {
        dispatch(fetchAllDoubts());
    }, [dispatch]);

    if (loading) return <Loader />;

    if (!allDoubts || allDoubts.length === 0) {
        return <div className='text-white text-center mt-10'>No doubts posted yet!</div>;
    }

    return (
        <div className="space-y-4">
            {allDoubts.map((doubt) => (
                <DoubtCard key={doubt._id} doubt={doubt} />
            ))}
        </div>
    );
};

export default DoubtList;
