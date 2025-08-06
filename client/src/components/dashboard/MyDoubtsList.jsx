import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoubtsByUser, deleteDoubt } from "../../features/doubtSlice";
import { useNavigate } from "react-router";
import { Loader, Button, ConfirmModal } from "../ComponentImport";
import { useModal } from "../../contexts/ModalContext";
import { toast } from "react-toastify";

function MyDoubtsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { myDoubts, loading } = useSelector((state) => state.doubt);
    const { openConfirmModal, confirmModalProps, isConfirmModalOpen } = useModal();

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchDoubtsByUser(user._id));
        }
    }, [dispatch, user]);

    const handleDelete = (doubtId) => {
        openConfirmModal({
            title: "Delete Doubt?",
            message: "Are you sure you want to delete this doubt permanently?",
            onConfirm: async () => {
                try {
                    await dispatch(deleteDoubt(doubtId)).unwrap();
                } catch (err) {
                    toast.error(err || "Deletion failed");
                }
            },
            onCancel: () => {
                toast.info("Cancelled");
            }
        });
    };

    return (
        <div className="px-8">
            {loading ? (
                <Loader />
            ) : myDoubts.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">You haven't asked any doubts yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-6">
                    {myDoubts.map((doubt) => (
                        <div
                            key={doubt._id}
                            className="bg-zinc-900 text-white border border-gray-700 p-6 rounded-xl shadow-sm space-y-4"
                        >
                            <p className="text-lg">{doubt.description}</p>

                            <p className="text-sm text-gray-500">
                                Replies: {doubt.replies?.length || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                Asked on:{" "}
                                {new Date(doubt.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            <div className="flex gap-3 mt-3">
                                <Button
                                    title="View Replies"
                                    className="px-3 py-2 bg-blue-600 text-white text-sm hover:bg-blue-800"
                                    onClick={() => navigate(`/doubts/${doubt._id}`)}
                                />
                                <Button
                                    title="Delete"
                                    className="px-3 py-2 bg-red-600 text-white text-sm hover:bg-red-800"
                                    onClick={() => handleDelete(doubt._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isConfirmModalOpen && <ConfirmModal {...confirmModalProps} />}
        </div>
    );
}

export default MyDoubtsList;
