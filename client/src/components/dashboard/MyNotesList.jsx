import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyNotes, deleteNote } from '../../features/notesSlice';
import { Loader, Button, ViewNoteModal, ConfirmModal } from '../../components/ComponentImport';
import { useModal } from '../../contexts/ModalContext';

function MyNotesList() {
    const dispatch = useDispatch();

    const { myNotes, isLoading } = useSelector((state) => state.notes);

    const {
        isViewModalOpen,
        viewNoteId,
        openViewModal,
        closeViewModal,
        openConfirmModal,
        confirmModalProps,
        isConfirmModalOpen,
    } = useModal();

    useEffect(() => {
        dispatch(fetchMyNotes());
    }, [dispatch]);


    const handleDelete = (noteId) => {
        openConfirmModal({
            title: "Delete Note",
            message: "Are you sure you want to delete this note? This action cannot be undone.",
            onConfirm: () => dispatch(deleteNote(noteId)),
        });
    };

    return (
        <div className='px-8'>
            {isLoading ? (
                <Loader />
            ) : myNotes.length === 0 ? (
                <div className="text-gray-500">No notes found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
                    {myNotes.map((note) => (
                        <div key={note._id} className="p-4 border border-gray-700 rounded-xl shadow-sm bg-zinc-900 text-white">
                            <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
                            <p className="text-sm mb-2">{note.subject}</p>
                            <p className="text-sm mb-2">{note.description}</p>

                            <p className="text-xs text-gray-400 my-3">
                                Uploaded on:{" "}
                                {new Date(note.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            <div className="mt-3 flex gap-4">
                                <Button
                                    title="View Note"
                                    onClick={() => openViewModal(note._id)} // ✅ Same logic
                                    className="px-3 py-2 bg-blue-700 text-white text-sm hover:bg-blue-900"
                                />

                                <Button
                                    title="Delete Note"
                                    onClick={() => handleDelete(note._id)}
                                    className="px-3 py-2 bg-red-600 text-white text-sm hover:bg-red-800"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 👁️ ViewNoteModal for My Notes */}
            {isViewModalOpen && (
                <ViewNoteModal
                    noteId={viewNoteId}
                    onClose={closeViewModal}
                />
            )}

            {isConfirmModalOpen && <ConfirmModal {...confirmModalProps} />}
        </div>
    );
}

export default MyNotesList;
