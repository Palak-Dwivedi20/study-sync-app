import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    NotesCard,
    SearchBar,
    UploadNotesModal,
    Loader,
    ViewNoteModal
} from '../ComponentImport';
import { FaEllipsisVertical } from "react-icons/fa6";
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useModal } from '../../contexts/ModalContext';
import { fetchAllNotes } from '../../features/notesSlice';

function NotesDashboard() {
    const dispatch = useDispatch();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const {
        isUploadModalOpen,
        openUploadModal,
        isViewModalOpen,
        viewNoteId,
        openViewModal,
        closeViewModal
    } = useModal();

    // 🟡 Redux state
    const { notesData, isLoading, error } = useSelector(state => state.notes);
    const allNotes = notesData?.notes || [];

    // 🔁 Fetch notes on mount
    useEffect(() => {
        dispatch(fetchAllNotes());
    }, [dispatch]);

    return (
        <div className='min-h-[calc(100vh-60px)] w-full rounded-2xl bg-black text-white'>
            <div className="p-10">
                <h1 className="text-2xl font-semibold mb-4">Notes</h1>

                <div className='flex justify-between relative'>
                    <div className="mb-6 w-70 lg:w-96">
                        <SearchBar placeholder='Search Notes' className='bg-gray-900' />
                    </div>

                    {isDesktop ? (
                        <Button
                            title='Upload Notes'
                            className='px-3 py-2 bg-blue-800 text-white hover:bg-blue-900'
                            onClick={openUploadModal}
                        />
                    ) : (
                        <div
                            onMouseEnter={() => setSubMenuOpen(true)}
                            onMouseLeave={() => setSubMenuOpen(false)}
                        >
                            <div className='pl-3 text-3xl opacity-70 cursor-pointer'>
                                <FaEllipsisVertical onClick={() => setSubMenuOpen(!subMenuOpen)} />
                            </div>
                            {subMenuOpen && (
                                <div className='absolute top-10 right-0 duration-300'>
                                    <Button
                                        title='Upload Notes'
                                        className='px-3 py-2 bg-blue-800 text-white hover:bg-blue-900'
                                        onClick={openUploadModal}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {isUploadModalOpen && <UploadNotesModal />}
                </div>

                {/* 🔄 Loading */}
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader />
                    </div>
                )}

                {/* ❌ Error */}
                {!isLoading && error && (
                    <div className="text-center text-red-500 mb-4">
                        {error}
                    </div>
                )}

                {/* 📝 Notes Grid */}
                {!isLoading && allNotes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
                        {allNotes.map((note) => (
                            <NotesCard
                                key={note._id}
                                note={note}
                                onView={() => openViewModal(note._id)}
                            />
                        ))}
                    </div>
                )}

                {/* 🚫 No Notes */}
                {!isLoading && allNotes.length === 0 && !error && (
                    <div className="text-center text-gray-500 mt-10">
                        No notes found.
                    </div>
                )}

                {/* 👁️ View Modal */}
                {isViewModalOpen && (
                    <ViewNoteModal
                        noteId={viewNoteId}
                        onClose={closeViewModal}
                    />
                )}
            </div>
        </div>
    );
}

export default NotesDashboard;
