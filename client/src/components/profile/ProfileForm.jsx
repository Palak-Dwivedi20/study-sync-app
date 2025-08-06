// src/components/ProfileForm.jsx
import React, { useEffect, useState } from 'react';
import { Button, Input, Loader, Textarea } from '../ComponentImport';
import { useForm } from 'react-hook-form';
import { FaRegEdit, FaUser } from "react-icons/fa";
import { useSelector } from 'react-redux';



function ProfileForm({ defaultValues, avatarUrl, coverUrl, onSubmit }) {

    const { loading } = useSelector(state => state.profile);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
        watch
    } = useForm({ defaultValues });

    // Avatar and Cover file states
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(avatarUrl || null);
    const [coverPreview, setCoverPreview] = useState(coverUrl || null);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const isFormDirty = isDirty || avatarFile !== null || coverFile !== null;
    const watchedFields = watch();


    useEffect(() => {
        const formChanged = isDirty;
        const avatarChanged = avatarFile !== null;
        const coverChanged = coverFile !== null;
        setIsFormChanged(formChanged || avatarChanged || coverChanged);
    }, [isDirty, avatarFile, coverFile, watchedFields]);


    // Update form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
        setAvatarPreview(avatarUrl || null);
        setCoverPreview(coverUrl || null);
    }, [defaultValues, avatarUrl, coverUrl, reset]);



    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];


    const validateAndSetFile = (file, setter, previewSetter, type) => {
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Only JPG, JPEG, PNG images are allowed.");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("File too large. Max size is 2MB.");
            return;
        }
        setter(file);
        previewSetter(URL.createObjectURL(file));
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        validateAndSetFile(file, setAvatarFile, setAvatarPreview, 'avatar');
    };


    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        validateAndSetFile(file, setCoverFile, setCoverPreview, 'cover');
    };


    const handleFormSubmit = (data) => {
        onSubmit?.({
            ...data,
            avatarFile,
            coverFile
        });
    };


    useEffect(() => {
        return () => {
            avatarPreview && URL.revokeObjectURL(avatarPreview);
            coverPreview && URL.revokeObjectURL(coverPreview);
        };
    }, [avatarPreview, coverPreview]);


    return (
        <div className="max-w-3xl mx-auto mt-8 p-8 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900">

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
            >
                {/* Cover Image with Edit Icon */}
                <div className="relative h-48 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border border-gray-700 group">

                    {coverPreview ? (
                        <img
                            src={coverPreview}
                            alt="Cover"
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className='h-48 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden group' />
                    )}


                    <label
                        htmlFor="coverImage"
                        aria-label="Edit cover image"
                        className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                    >
                        <FaRegEdit className="h-5 w-5" />
                        <input
                            id="coverImage"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            hidden
                            onChange={handleCoverChange}
                        />
                    </label>

                </div>

                {/* Avatar */}
                <div className="relative -mt-12 ml-6 w-24 h-24">

                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center shadow">
                            <FaUser className="w-15 h-15 text-zinc-500 dark:text-zinc-400" />
                        </div>
                    )}

                    <label
                        htmlFor="avatar"
                        aria-label="Edit avatar"
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 cursor-pointer transition"
                    >
                        <FaRegEdit className="h-5 w-5 text-white" />
                        <input
                            id="avatar"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            hidden
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>


                <div className='h-20 text-zinc-500 dark:text-zinc-200'>
                    <Input
                        type="text"
                        label="Full Name"
                        placeholder="Full Name"
                        className="text-zinc-500 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        {...register("fullName", {
                            required: "Name is required!",
                            minLength: { value: 3, message: "At least 3 characters" },
                            maxLength: { value: 30, message: "At most 30 characters" },
                            validate: {
                                matchPattern: value => /^[A-Za-z\s'-]+$/.test(value) || "Enter a valid name!"
                            }
                        })}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm px-3">{errors.fullName.message}</p>}
                </div>

                <div className='h-20 text-zinc-500 dark:text-zinc-200'>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Email"
                        className="text-zinc-500 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        {...register("email", {
                            required: "Email is required!",
                            validate: {
                                matchPattern: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-sm px-3">{errors.email.message}</p>}
                </div>

                <div className='h-20 text-zinc-500 dark:text-zinc-200'>
                    <Input
                        type="text"
                        label="Username"
                        placeholder="Username"
                        className="text-zinc-500 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        {...register("username", {
                            required: "Username is required!",
                            minLength: { value: 3, message: "At least 3 characters" },
                            maxLength: { value: 30, message: "At most 30 characters" },
                            validate: {
                                matchPattern: value => /^[^\s]+$/.test(value) || "Spaces not allowed!"
                            }
                        })}
                    />
                    {errors.username && <p className="text-red-500 text-sm px-3">{errors.username.message}</p>}
                </div>

                <div className='text-zinc-500 dark:text-zinc-200'>
                    <Textarea
                        label="Bio"
                        placeholder="Bio..."
                        className="text-zinc-500 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        {...register("bio", {
                            maxLength: { value: 300, message: "At most 300 characters" }
                        })}
                    />
                    {errors.bio && <p className="text-red-500 text-sm px-3">{errors.bio.message}</p>}
                </div>

                <div className='flex justify-end'>
                    <Button
                        type="submit"
                        title={loading ? "Saving..." : "Save Profile"}
                        className="mt-4 py-2 px-4 rounded-lg bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                        disabled={!isFormChanged}
                    />
                </div>

            </form>

        </div>
    );
}

export default ProfileForm;
