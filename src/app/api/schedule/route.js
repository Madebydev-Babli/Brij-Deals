import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { RestaurentModel } from "../../../../backend/models/restaurent";
import { TimingScheduleModel } from "../../../../backend/models/timingSchedule";

export async function POST(req) {

    let session = null;

    try {

        await connectToDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const { _id, restaurentId, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = await req.json();

        const restaurant = await RestaurentModel.findById(restaurentId);

        if (!restaurant) {
            return NextResponse.json({ status: "error", message: "Restaurant not found", data: null, error: "Restaurant not found" }, { status: 404 });
        }

        const days = { monday, tuesday, wednesday, thursday, friday, saturday, sunday };

        for (let day in days) {

            if (days[day].opening && !days[day].closing) {
                return NextResponse.json({ status: "error", message: `For ${day}, Closing time is required`, data: null, error: `For ${day}, Closing time is required` }, { status: 400 });
            }

            if (!days[day].opening && days[day].closing) {
                return NextResponse.json({ status: "error", message: `For ${day}, Opening time is required`, data: null, error: `For ${day}, Opening time is required` }, { status: 400 });
            }

            if (days[day].opening && days[day].closing && days[day].opening >= days[day].closing) {
                return NextResponse.json({ status: "error", message: `For ${day}, Opening time must be less than closing time`, data: null, error: `For ${day}, Opening time must be less than closing time` }, { status: 400 });
            }
        }

        if (_id) {

            const timingSchedule = await TimingScheduleModel.findById(_id);

            if (!timingSchedule) {
                return NextResponse.json({ status: "error", message: "Schedule not found", data: null, error: "Schedule not found" }, { status: 404 });
            }

            await TimingScheduleModel.findByIdAndUpdate(_id,
                {
                    restaurentId,
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                    sunday,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Schedule updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const newTimingSchedule = new TimingScheduleModel({
                restaurentId,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday,
            });

            await newTimingSchedule.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Schedule added successfully", data: null, error: null }, { status: 201 });
        }

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

export async function GET(req) {

    try {

        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, restaurentId } = Object.fromEntries(searchParams.entries());

        const search = {
            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
            restaurentId: mongoose.Types.ObjectId.isValid(restaurentId) ? restaurentId : undefined,
        };

        clearSearch(search);

        const timingSchedules = await TimingScheduleModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await TimingScheduleModel.find(search).countDocuments();
        const totalData = await TimingScheduleModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Schedule fetched successfully", data: { data: timingSchedules, extra }, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}