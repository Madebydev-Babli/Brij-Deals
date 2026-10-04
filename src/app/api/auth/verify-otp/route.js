import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { UserModel } from '../../../../../backend/models/user';
import { OtpModel } from '../../../../../backend/models/otp';
import mongoose from 'mongoose';
import { getErrorMessage, validatePassword } from '@/utility/server-utility';

export async function POST(req) {

    let session = null;

    try {
        await connectToDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        const { email, password, confirmPassword, otp } = await req.json();

        if (!email) {
            return NextResponse.json({ status: "error", data: null, message: "Email is required", error: "Email is required" }, { status: 400 });
        }

        if (!password) {
            return NextResponse.json({ status: "error", data: null, message: "Password is required", error: "Password is required" }, { status: 400 });
        }

        if (!confirmPassword) {
            return NextResponse.json({ status: "error", data: null, message: "Confirm Password is required", error: "Confirm Password is required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ status: "error", data: null, message: "Confirm Password does not match", error: "Confirm Password does not match" }, { status: 400 });
        }

        if (!otp) {
            return NextResponse.json({ status: "error", data: null, message: "OTP is required", error: "OTP is required" }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({ status: "error", data: null, message: "User not found", error: "User not found" }, { status: 404 });
        }

        const checkPassword = validatePassword(password);
        if (!checkPassword.status) return NextResponse.json({ status: "error", data: null, message: checkPassword.message, error: checkPassword.message }, { status: 400 });


        if (password !== confirmPassword) {
            return NextResponse.json({ status: "error", data: null, message: "Confirm password does not match", error: "Confirm password does not match" }, { status: 400 });
        }

        const otpDoc = await OtpModel.findOne({ userId: user._id });

        if (!otpDoc) {
            return NextResponse.json({ status: "error", data: null, message: "OTP not found", error: "OTP not found" }, { status: 404 });
        }

        if (otpDoc.attempts >= 3) {
            return NextResponse.json({ status: "error", data: null, message: "Too many attempts", error: "Too many attempts" }, { status: 400 });
        }

        if (otpDoc.expiresAt < Date.now()) {
            return NextResponse.json({ status: "error", data: null, message: "OTP expired", error: "OTP expired" }, { status: 400 });
        }

        if (otpDoc.otp != otp) {
            await OtpModel.findByIdAndUpdate(otpDoc._id, { $inc: { attempts: 1 } }, { session });
            await session.commitTransaction();
            session.endSession();
            return NextResponse.json({ status: "error", data: null, message: "Invalid OTP", error: "Invalid OTP" }, { status: 400 });
        }

        await UserModel.findByIdAndUpdate(user._id, { password }, { session });
        await OtpModel.findByIdAndDelete(otpDoc._id, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ status: "success", data: null, message: "Password updated successfully", error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
} 