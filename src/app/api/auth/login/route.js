import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { UserModel } from '../../../../../backend/models/user';
import { getErrorMessage } from '@/utility/server-utility';

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

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({ status: "error", data: null, message: "Invalid credentials", error: "Invalid credentials" }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json({ status: "error", data: null, message: "Invalid credentials", error: "Invalid credentials" }, { status: 401 });
        }

        await UserModel.findOneAndUpdate({ email }, { isLoggedIn: true }, { new: true });

        const tokenPayload = {
            _id: user._id,
            email: user.email,
            isLoggedIn: user.isLoggedIn,
        }

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
        return NextResponse.json({ status: "success", data: { token: token, email: user.email }, message: "Login successful", error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
} 