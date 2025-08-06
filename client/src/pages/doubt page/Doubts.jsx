import React from 'react';
import { DoubtForm, DoubtList } from '../../components/ComponentImport';


const Doubts = () => {
    return (
        <div className="min-h-[calc(100vh-60px)] overflow-auto bg-black w-full p-10">
            <h1 className="text-2xl text-white font-bold mb-4 max-w-4xl w-full mx-auto">Doubt Discussions</h1>

            {/* Post New Doubt */}
            <DoubtForm />

            {/* All Doubts */}
            <DoubtList />
        </div>
    );
};

export default Doubts;
