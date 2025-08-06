import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { OtpVerifyForm } from '../../components/ComponentImport';
import { verifyOTP } from '../../features/authSlice';
import { toast } from 'react-toastify';

function OTPVerify() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userId = location.state?.userId;

    const handleVerify = async (enteredOtp) => {
        try {
            if (!userId) {
                toast.error("User ID missing!");
                return;
            }

            await dispatch(verifyOTP({
                userId,
                otp: enteredOtp,
                otpType: "emailVerification"
            })).unwrap();

            // toast.success("OTP Verified! You're logged in ✅");
            alert("OTP Verified! You're logged in ✅");
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            toast.error(err || "OTP Verification failed!");
        }
    };


    const handleResend = async () => {
        try {
            if (!userId) {
                toast.error("User ID missing!");
                return;
            }

            await dispatch(generateOTP({
                userId,
                channel: "email",
                otpType: "emailVerification"
            })).unwrap();

            toast.success("OTP sent to your email again ✅");
            alert("OTP sent to your email again ✅");

        } catch (err) {
            console.error(err);
            toast.error(err || "Resend OTP failed!");
        }
    };


    return (
        <div className='min-h-screen flex justify-center relative bg-zinc-500'>
            <div className='absolute top-32'>
                <OtpVerifyForm
                    onVerify={handleVerify}
                    onResend={handleResend}
                />
            </div>
        </div>
    );
}

export default OTPVerify;
