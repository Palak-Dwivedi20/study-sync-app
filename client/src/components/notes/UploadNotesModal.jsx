import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Select } from '../ComponentImport';
import { FaXmark } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { useModal } from '../../contexts/ModalContext';
import { uploadNotes, fetchAllNotes } from '../../features/notesSlice';
import { toast } from 'react-toastify';

function UploadNotesModal() {
    const dispatch = useDispatch();
    const { closeUploadModal } = useModal();

    const bgRef = useRef(null);
    const closeOver = (e) => {
        if (bgRef.current === e.target) {
            closeUploadModal();
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('subject', data.subject);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('fileType', data.fileType);
        formData.append('file', data.file[0]); // File array

        try {
            setLoading(true);
            const res = await dispatch(uploadNotes(formData)).unwrap();

            toast.success(res.message || 'Notes uploaded successfully!');
            reset();
            closeUploadModal();
            dispatch(fetchAllNotes()); // Refresh notes list
        } catch (err) {
            toast.error(err?.message || 'Failed to upload notes!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-40 backdrop-brightness-30 backdrop-blur-xs transition-opacity"
            ref={bgRef}
            onClick={closeOver}
            aria-hidden="true"
        >
            <div
                className="max-w-2xl w-full h-[80%] overflow-y-auto flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 bg-gray-900 rounded shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex justify-end p-4 border-b">
                    <FaXmark
                        className="text-xl text-white hover:text-gray-400 cursor-pointer"
                        onClick={closeUploadModal}
                        aria-label="Close"
                    />
                </div>

                <div className="flex flex-col gap-4 p-7 mx-8 mt-7 bg-black text-white border rounded shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                        <div>
                            <Input
                                label="Subject*"
                                placeholder="EX: DSA.."
                                {...register("subject", { required: "Required!" })}
                            />
                            {errors.subject && <p className="text-red-500 text-sm px-3">{errors.subject.message}</p>}
                        </div>
                        <div>
                            <Input
                                label="Title*"
                                placeholder="EX: Sorting Algorithms.."
                                {...register("title", { required: "Required!" })}
                            />
                            {errors.title && <p className="text-red-500 text-sm px-3">{errors.title.message}</p>}
                        </div>
                        <div>
                            <Input
                                label="Description*"
                                placeholder="EX: Overview of sorting.."
                                {...register("description", { required: "Required!" })}
                            />
                            {errors.description && <p className="text-red-500 text-sm px-3">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Select
                                label="File Type*"
                                options={[
                                    { value: "", label: "Select File Type" },
                                    "pdf",
                                    "docx",
                                    "pptx"
                                ]}
                                {...register("fileType", { required: "Required!" })}
                            />
                            {errors.fileType && <p className="text-red-500 text-sm px-3">{errors.fileType.message}</p>}
                        </div>
                        <div>
                            <Input
                                label="File*"
                                type="file"
                                {...register("file", { required: "Required!" })}
                            />
                            {errors.file && <p className="text-red-500 text-sm px-3">{errors.file.message}</p>}
                        </div>

                        <div className="flex justify-center items-center w-full mt-6">
                            <Button
                                type="submit"
                                title={loading ? 'Uploading...' : 'Upload'}
                                disabled={loading}
                                className={`px-4 py-3 w-40 ${loading ? 'bg-blue-400' : 'bg-blue-800'} text-white text-md font-semibold rounded hover:bg-blue-900`}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadNotesModal;
