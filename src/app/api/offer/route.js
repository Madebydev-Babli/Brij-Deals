import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { OfferModel } from "../../../../backend/models/offer";
import { RestaurentModel } from "../../../../backend/models/restaurent";

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

        const { _id, restaurentId, sno, title, description, endDate } = await req.json();
        const maxSno = await OfferModel.findOne({}).sort({ sno: -1 });

        if (restaurentId) {

            const restaurent = await RestaurentModel.findById(restaurentId);

            if (!restaurent) {
                return NextResponse.json({ status: "error", message: "Restaurent not found", data: null, error: "Restaurent not found" }, { status: 404 });
            }
        }

        if (!title) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ status: "error", message: "Description is required", data: null, error: "Description is required" }, { status: 400 });
        }

        if (!endDate) {
            return NextResponse.json({ status: "error", message: "End Date is required", data: null, error: "End Date is required" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const offer = await OfferModel.findById(_id);

            if (!offer) {
                return NextResponse.json({ status: "error", message: "Offer not found", data: null, error: "Offer not found" }, { status: 404 });
            }

            if (sno < offer.sno) {
                await OfferModel.updateMany({ sno: { $gte: sno, $lt: offer.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > offer.sno) {
                await OfferModel.updateMany({ sno: { $gt: offer.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            await OfferModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    restaurentId,
                    title,
                    description,
                    endDate
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Offer updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await OfferModel.findOne({ sno });

            if (snoPresent) {
                await OfferModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const newOffer = new OfferModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                restaurentId,
                title,
                description,
                endDate
            });

            await newOffer.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Offer added successfully", data: null, error: null }, { status: 201 });
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
                    description: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                }
            ],
        }

        clearSearch(search);

        const offers = await OfferModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await OfferModel.find(search).countDocuments();
        const totalData = await OfferModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Offers fetched successfully", data: { data: offers, extra }, error: null }, { status: 200 });

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

        const deleted = await OfferModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Offer not found", data: null, error: "Offer not found" }, { status: 404 });
        }

        await OfferModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ status: "success", message: "Offer deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}