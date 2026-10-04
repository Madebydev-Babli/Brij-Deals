import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        email: {
            type: String,
            required: [true, "Email is required"],
        },

        otp: {
            type: Number,
            required: [true, "OTP is required"],
        },
        expiresAt: {
            type: Date,
            default: Date.now() + 5 * 60 * 1000,
        },
        attempts: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

export const OtpModel = mongoose.models.Otp || mongoose.model('Otp', schema); 