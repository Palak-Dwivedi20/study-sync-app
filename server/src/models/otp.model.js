import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    otpType: {
        type: String,
        enum: ['emailVerification', 'passwordReset'],
        required: true
    },
    channel: {
        type: String,
        enum: ['email'],
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model("OTP", otpSchema);
