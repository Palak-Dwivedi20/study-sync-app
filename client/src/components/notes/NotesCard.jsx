import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeNote } from "../../features/notesSlice";
import { Button } from "../ComponentImport";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

function NotesCard({ note, onView }) {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);

    const [likes, setLikes] = useState(note.likes || []);
    const [hasLiked, setHasLiked] = useState(false);
    const [showPop, setShowPop] = useState(false);

    useEffect(() => {
        setLikes(note.likes || []);
        setHasLiked(note.likes.includes(userId));
    }, [note.likes, userId]);

    const handleLike = () => {
        if (hasLiked) {
            setLikes((prev) => prev.filter((id) => id !== userId));
        } else {
            setLikes((prev) => [...prev, userId]);
            setShowPop(true);
            setTimeout(() => setShowPop(false), 500);
        }

        setHasLiked(!hasLiked);
        dispatch(likeNote(note._id));
    };

    return (
        <div className="border border-gray-600 p-4 rounded shadow-sm bg-zinc-900 text-white">
            <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
            <p className="text-sm mb-2">{note.subject}</p>
            <p className="text-sm mb-2">{note.description}</p>

            <div className="text-xs text-gray-400 my-3">
                By {note.uploadedBy?.fullName || "Unknown"}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
                <span
                    className="relative flex items-center gap-1 cursor-pointer"
                    onClick={handleLike}
                >
                    <div className="w-5 h-5 relative flex items-center justify-center">
                        <AnimatePresence>
                            {showPop ? (
                                <motion.span
                                    key="pop-heart"
                                    className="absolute"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 1, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaHeart className="text-red-500 text-xl" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="static-heart"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {hasLiked ? (
                                        <FaHeart className="text-red-500 text-xl" />
                                    ) : (
                                        <FaRegHeart className="text-red-500 text-xl" />
                                    )}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {likes.length}
                </span>


                <span className="text-xs text-gray-400">
                    Uploaded on:{" "}
                    {new Date(note.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </span>


                <Button
                    title="View Notes"
                    onClick={onView}
                    className="px-3 py-2 bg-blue-800 text-white text-sm hover:bg-blue-900"
                />
            </div>
        </div>
    );
}

export default NotesCard;
