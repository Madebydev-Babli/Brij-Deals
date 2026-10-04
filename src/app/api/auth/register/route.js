import { NextResponse } from 'next/server';
import { getErrorMessage } from '@/utility/server-utility';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { UserModel } from '../../../../../backend/models/user';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, password } = await req.json();

        if (!email) {
            return NextResponse.json({ status: "error", data: null, message: "Email is required", error: "Email is required" }, { status: 400 });
        }

        if (!password) {
            return NextResponse.json({ status: "error", data: null, message: "Password is required", error: "Password is required" }, { status: 400 });
        }

        const newUser = new UserModel({ email, password });

        await newUser.save();

        return NextResponse.json({ status: "success", data: null, message: "Registration successful", error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

