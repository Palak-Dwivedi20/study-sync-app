import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Button } from '../ComponentImport';
import { useModal } from '../../contexts/ModalContext';
import { fetchNoteById, clearSelectedNote } from '../../features/notesSlice';
import { FaXmark } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";

function ViewNoteModal({ noteId }) {
    const dispatch = useDispatch();
    const { closeViewModal } = useModal();
    const bgRef = useRef(null);

    // Close modal if clicked outside
    const closeOver = (e) => {
        if (bgRef.current === e.target) {
            dispatch(clearSelectedNote());
            closeViewModal();
        }
    };

    // Fetch note details on mount
    useEffect(() => {
        if (noteId) {
            dispatch(fetchNoteById(noteId));
        }

        // Clear selectedNote on unmount
        return () => {
            dispatch(clearSelectedNote());
        };
    }, [dispatch, noteId]);

    const { selectedNote: note, isLoading, error } = useSelector((state) => state.notes);

    return (
        <div
            className="fixed inset-0 z-50 backdrop-brightness-30 backdrop-blur-xs transition-opacity"
            ref={bgRef}
            onClick={closeOver}
            aria-hidden="true"
        >
            <div
                className="max-w-5xl w-[90%] h-[90%] overflow-y-auto flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 bg-gray-900 text-white rounded shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-end p-4 border-b">
                    <FaXmark
                        className="text-xl text-white hover:text-gray-400 cursor-pointer"
                        onClick={() => {
                            dispatch(clearSelectedNote());
                            closeViewModal();
                        }}
                        aria-label="Close"
                    />
                </div>

                {isLoading && (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader />
                    </div>
                )}

                {error && (
                    <div className="flex-1 text-center text-red-500 p-6">
                        {error}
                    </div>
                )}

                {!isLoading && note && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto no-scrollbar">
                        {/* Left Content */}
                        <div className="flex flex-col justify-center items-center gap-3 bg-zinc-800 p-5 rounded-lg">
                            <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
                            <p className="text-white">
                                <span className="font-medium">Subject:</span> {note.subject}
                            </p>
                            <p className="text-white">{note.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Uploaded By: <span className="font-medium">{note.uploadedBy?.fullName || "Unknown"}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Uploaded On: {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                Likes: {note.likes?.length || 0}
                            </p>

                            <div className="mt-4">
                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
                                >
                                    Download Notes
                                </a>
                            </div>
                        </div>

                        {/* Right Content: File Preview */}
                        <div className="w-full h-full flex justify-center items-center border rounded p-2">
                            {note.fileType === 'pdf' ? (
                                <iframe
                                    src={note.fileUrl}
                                    title="PDF Viewer"
                                    className="w-full h-[500px] rounded"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex flex-col items-center text-center text-gray-600">
                                    <FaFilePdf className="text-[100px] text-red-600 mb-4" />
                                    <p className="text-sm">Preview not available for this file type.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewNoteModal;
