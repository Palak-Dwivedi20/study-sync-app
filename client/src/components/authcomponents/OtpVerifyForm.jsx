import { useState, useRef, useEffect } from "react";
import { Button, Input } from "../ComponentImport";

function OtpVerifyForm({ onVerify, onResend }) {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {

        const value = e.target.value.trim();
        if (!value || isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto move focus
        if (index < 5 && value) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);

            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text/plain");

        if (!pasteData || isNaN(pasteData)) return;

        if (pasteData.length === 6) {
            const newOtp = pasteData.split("").slice(0, 6);
            setOtp(newOtp);
            inputsRef.current[5]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        onVerify?.(enteredOtp);
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg mt-20 dark:bg-zinc-900">
            <h2 className="text-2xl text-zinc-500 dark:text-zinc-200 font-bold text-center mb-2">Verify OTP</h2>
            <p className="text-center text-zinc-500 dark:text-zinc-400 mb-6">
                Enter the 6-digit code sent to your email
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (

                        <Input
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            aria-label={`Digit ${index + 1} of 6`}
                            required
                            className="w-12 h-12 text-zinc-500 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-700 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    title="Verify"
                    className="w-full mt-4 py-2 px-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                />

                <Button
                    type="button"
                    title="Resend OTP"
                    onClick={() => {
                        onResend?.();
                        setOtp(new Array(6).fill(""));
                        inputsRef.current[0]?.focus();
                    }}
                    className="text-sm text-blue-600 hover:underline mt-2"
                />

            </form>
        </div >
    );
}

export default OtpVerifyForm;
