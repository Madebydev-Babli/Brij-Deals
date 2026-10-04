import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { UserModel } from '../../../../../backend/models/user';
import { OtpModel } from '../../../../../backend/models/otp';
import { getErrorMessage } from '@/utility/server-utility';
import sendMail from '../../../../../backend/configurations/mail.config';
import OtpTemplate from '../../../../email-templates/otp.js';

export async function POST(req) {

    try {
        await connectToDatabase();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ status: "error", data: null, message: "Email is required", error: "Email is required" }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({ status: "error", data: null, message: "User not found", error: "User not found" }, { status: 404 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await OtpModel.findOneAndUpdate({ userId: user._id }, { otp: otp, attempts: 0, expiresAt: Date.now() + 5 * 60 * 1000 }, { new: true, upsert: true });

        await sendMail(email, "Your OTP Verification Code", OtpTemplate(otp));

        return NextResponse.json({ status: "success", data: null, message: `OTP sent successfully`, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
} 