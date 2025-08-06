import { useEffect, useState, useRef } from "react";
import { Button, Input, Loader } from '../ComponentImport';
import { useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser, fetchCurrentUser } from "../../features/authSlice";
import { toast } from "react-toastify";
import { IoSchool } from "react-icons/io5";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useModalQuery } from "../../hooks/useModalQuery ";


function LoginForm({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data) => {
    setLocalError(null);

    try {
      setIsLoading(true);
      const res = await dispatch(loginUser(data)).unwrap();
      setIsLoading(false);

      // Auto fetch current user after login
      const userRes = await dispatch(fetchCurrentUser()).unwrap();

      if (!userRes?.isVerified) {
        toast.info("Please verify your account with OTP");
        navigate("/otp-verify");
      } else {
        toast.success("Login successful!");
        navigate("/dashboard");
      }

    } catch (error) {
      // error from thunk reject
      toast.error(error?.message || "Login failed");
      setLocalError(error?.message || "Invalid credentials");
    }
  };



  return (
    <div className="fixed inset-0 z-40 backdrop-blur-xs transition-opacity">
      <div
        ref={bgRef}
        className="w-full max-w-md p-4 bg-gray-900 text-white border-2 border-gray-700 rounded-bl-4xl rounded-tr-4xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className='flex justify-center gap-1 my-4'>
          <IoSchool className='text-4xl text-white' />
          <h1 className="text-3xl font-bold text-white">StudySync</h1>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Login</h2>

          {localError && <p className="text-red-600 mb-4 text-center">{localError}</p>}
          {isLoading && (
            <div className="flex justify-center my-4">
              <Loader />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <div className='h-20'>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required!",
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be valid",
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm px-3">{errors.email.message}</p>}
            </div>

            <div className='h-20'>
              <Input
                type="password"
                placeholder="Password"
                autoComplete="off"
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                  validate: (value) => {
                    if (!/[A-Z]/.test(value)) return "Include an uppercase letter!";
                    if (!/[a-z]/.test(value)) return "Include a lowercase letter!";
                    if (!/\d/.test(value)) return "Include a number!";
                    if (!/[^\w\s]/.test(value)) return "Include a special character!";
                    return true;
                  }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm px-3">{errors.password.message}</p>}
            </div>

            <Button
              type='submit'
              title={isLoading ? "Logging in..." : "Log in"}
              disabled={isLoading}
              className="w-full bg-blue-800 text-white p-3 rounded-md hover:bg-blue-900 duration-200 cursor-pointer disabled:opacity-50"
            />
          </form>


          <div className="flex flex-col justify-center items-center gap-3 mt-10 text-gray-400">
            <div className="flex space-x-2">
              <span>New user?</span>
              <Button
                type="button"
                title="Sign up now"
                className="text-blue-400 hover:text-blue-500"
                onClick={() => setModal("signup")}
              />
            </div>

            <div className="flex space-x-2">
              <span>Forget password?</span>
              <Button
                type="button"
                title="Reset here"
                className="text-blue-400 hover:text-blue-500"
                // onClick={() => setModal("signup")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
