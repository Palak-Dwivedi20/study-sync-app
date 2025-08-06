import { Button, Input } from '../ComponentImport';
import { useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, generateOTP } from '../../features/authSlice';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { IoSchool } from "react-icons/io5";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useModalQuery } from '../../hooks/useModalQuery ';


function SignupForm({ onClose }) {

    const { setModal } = useModalQuery();

    const bgRef = useRef();
    const preventCloseRef = useRef(false);

    useClickOutside(bgRef, () => {
        if (!preventCloseRef.current) {
            onClose?.();
        }
    });


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isVerified } = useSelector((state) => state.auth);


    const onSubmit = async (data) => {
        try {
            const res = await dispatch(registerUser(data)).unwrap();

            const userId = res?._id;

            if (!userId) {
                toast.error("Registration failed: User ID not returned!");
                return;
            }

            // 2. Generate OTP
            await dispatch(generateOTP({
                userId,
                channel: "email",
                otpType: "emailVerification"
            })).unwrap();

            if (!isVerified) {
                toast.success("Signup successful! OTP sent.");
                navigate("/verify-otp", { state: { userId } });
            } else {
                toast.error("Signup failed or user already verified.");
            }
        } catch (err) {
            toast.error(err?.message || 'Something went wrong during signup!');
        }
    };



    return (
        <div className="fixed inset-0 z-40 backdrop-blur-xs transition-opacity">
            <div
                ref={bgRef}
                className="w-full max-w-lg p-4 bg-gray-900 text-white border-2 border-gray-700 rounded-bl-4xl rounded-tr-4xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300"
                role="dialog"
                aria-modal="true"
            >
                <div className='flex justify-center gap-1 mt-4'>
                    <IoSchool className='text-4xl text-white' />
                    <h1 className="text-3xl font-bold text-white">StudySync</h1>
                </div>
                <div className="p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Sign up</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                        {/* Full Name */}
                        <div className='h-20'>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                {...register("fullName", {
                                    required: "Name is required!",
                                    minLength: { value: 3, message: "At least 3 characters" },
                                    maxLength: { value: 30, message: "At most 30 characters" },
                                    validate: {
                                        matchPattern: v => /^[A-Za-z\s'-]+$/.test(v) || "Enter a valid name!"
                                    }
                                })}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm px-3">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className='h-20'>
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required!",
                                    validate: {
                                        matchPattern: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                                            "Enter a valid email"
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-sm px-3">{errors.email.message}</p>}
                        </div>

                        {/* Username */}
                        <div className='h-20'>
                            <Input
                                type="text"
                                placeholder="Username"
                                {...register("username", {
                                    required: "Username is required!",
                                    minLength: { value: 3, message: "At least 3 characters" },
                                    maxLength: { value: 30, message: "At most 30 characters" },
                                    validate: {
                                        matchPattern: v => /^[^\s]+$/.test(v) || "No spaces allowed!"
                                    }
                                })}
                            />
                            {errors.username && <p className="text-red-500 text-sm px-3">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div className='h-20'>
                            <Input
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                {...register("password", {
                                    required: "Password is required!",
                                    minLength: { value: 8, message: "At least 8 characters" },
                                    validate: (v) => {
                                        if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter!";
                                        if (!/[a-z]/.test(v)) return "Include at least one lowercase letter!";
                                        if (!/\d/.test(v)) return "Include at least one number!";
                                        if (!/[^\w\s]/.test(v)) return "Include at least one special character!";
                                        return true;
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-sm px-3">{errors.password.message}</p>}
                        </div>

                        {/* Submit */}
                        <Button
                            title={isLoading ? 'Signing Up...' : 'Sign Up'}
                            className="w-full bg-blue-800 text-white p-3 rounded-md hover:bg-blue-900 duration-200"
                            disabled={isLoading}
                        />
                    </form>

                    <div className="flex justify-center gap-2 mt-6 text-center text-gray-400">
                        <span>Already have an account?</span>
                        <Button
                            type="button"
                            title='Log in'
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setModal("login")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
