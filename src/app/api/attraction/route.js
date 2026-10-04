import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { RestaurentModel } from "../../../../backend/models/restaurent";
import { TRAVEL_MODE_ENUM } from "@/utility/utility-data";
import { AttractionModel } from "../../../../backend/models/attraction";

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

        const { _id, restaurentId, sno, title, distance, duration, mode } = await req.json();
        const maxSno = await AttractionModel.findOne({ restaurentId }).sort({ sno: -1 });

        if (restaurentId) {

            const restaurent = await RestaurentModel.findById(restaurentId);

            if (!restaurent) {
                return NextResponse.json({ status: "error", message: "Restaurent not found", data: null, error: "Restaurent not found" }, { status: 404 });
            }
        }

        if (!title) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (!distance) {
            return NextResponse.json({ status: "error", message: "Distance is required", data: null, error: "Distance is required" }, { status: 400 });
        }

        if (!duration) {
            return NextResponse.json({ status: "error", message: "Duration is required", data: null, error: "Duration is required" }, { status: 400 });
        }

        if (!mode) {
            return NextResponse.json({ status: "error", message: "Mode is required", data: null, error: "Mode is required" }, { status: 400 });
        }

        if (!TRAVEL_MODE_ENUM.includes(mode)) {
            return NextResponse.json({ status: "error", message: "Invalid mode", data: null, error: "Invalid mode" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const attraction = await AttractionModel.findById(_id);

            if (!attraction) {
                return NextResponse.json({ status: "error", message: "Offer not found", data: null, error: "Offer not found" }, { status: 404 });
            }

            if (sno < attraction.sno) {
                await AttractionModel.updateMany({ sno: { $gte: sno, $lt: attraction.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > attraction.sno) {
                await AttractionModel.updateMany({ sno: { $gt: attraction.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            await AttractionModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    restaurentId,
                    title,
                    distance,
                    duration,
                    mode
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Offer updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await AttractionModel.findOne({ sno });

            if (snoPresent) {
                await AttractionModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const newAttraction = new AttractionModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                restaurentId,
                title,
                distance,
                duration,
                mode
            });

            await newAttraction.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Attraction added successfully", data: null, error: null }, { status: 201 });
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

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, searchValue = "", restaurentId } = Object.fromEntries(searchParams.entries());

        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
            restaurentId: mongoose.Types.ObjectId.isValid(restaurentId) ? restaurentId : undefined,

            $or: [
                {
                    title: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    distance: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    duration: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    mode: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                }
            ],
        }

        clearSearch(search);

        const attractions = await AttractionModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await AttractionModel.find(search).countDocuments();
        const totalData = await AttractionModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Attractions fetched successfully", data: { data: attractions, extra }, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req) {

    let session = null;

    try {

        await connectToDatabase();

        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const { _id } = await req.json();

        if (!_id) {
            return NextResponse.json({ status: "error", message: "_id is required", data: null, error: "_id is required" }, { status: 400 });
        }

        const deleted = await AttractionModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Attraction not found", data: null, error: "Attraction not found" }, { status: 404 });
        }

        await AttractionModel.updateMany({ restaurentId: deleted.restaurentId, sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ status: "success", message: "Attraction deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}