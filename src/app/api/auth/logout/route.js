import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { UserModel } from '../../../../../backend/models/user';
import { getErrorMessage } from '@/utility/server-utility';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ status: "error", data: null, message: "Email is required", error: "Email is required" }, { status: 400 });
        }

        const updatedUser = await UserModel.findOneAndUpdate({ email }, { isLoggedIn: false }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ status: "error", data: null, message: "User not found", error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ status: "success", data: null, message: "Logged out successfully", error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}
