import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../backend/configurations/mongoose.config';
import { verifyToken } from '../../../../../backend/middlewares/verify-token';
import { UserModel } from '../../../../../backend/models/user';
import { getErrorMessage } from '@/utility/server-utility';

export async function GET(req) {

    try {
        await connectToDatabase();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const user = await UserModel.findById(decoded._id);

        if (!user) {
            return NextResponse.json({ status: "error", data: null, message: "User not found", error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ status: "success", data: user, message: "Profile fetched successfully", error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
} 