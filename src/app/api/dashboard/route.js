import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { getErrorMessage } from "@/utility/server-utility";

export async function GET(req) {

    try {

        await connectToDatabase();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const data = {};

        data.totalServices = 0;
        data.totalLeads = 0;
        data.totalTeamMembers = 0;
        data.totalLoanApplications = 0;
        data.totalLoanTestimonials = 0;

        return NextResponse.json({ status: "success", message: "Dashboard data fetched successfully", data: data, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}
