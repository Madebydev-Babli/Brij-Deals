import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { FaqModel } from "../../../../backend/models/faq";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";

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

        const { _id, sno, question, answer, page } = await req.json();
        const maxSno = await FaqModel.findOne({}).sort({ sno: -1 });

        if (!question) {
            return NextResponse.json({ status: "error", message: "Question is required", data: null, error: "Question is required" }, { status: 400 });
        }

        if (!answer) {
            return NextResponse.json({ status: "error", message: "Answere is required", data: null, error: "Answere is required" }, { status: 400 });
        }

        if (!page) {
            return NextResponse.json({ status: "error", message: "Page is required", data: null, error: "Page is required" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const faq = await FaqModel.findById(_id);

            if (!faq) {
                return NextResponse.json({ status: "error", message: "FAQ not found", data: null, error: "FAQ not found" }, { status: 404 });
            }

            if (sno < faq.sno) {
                await FaqModel.updateMany({ sno: { $gte: sno, $lt: faq.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > faq.sno) {
                await FaqModel.updateMany({ sno: { $gt: faq.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            await FaqModel.findByIdAndUpdate(_id, { sno: maxSno.sno >= sno ? sno : maxSno.sno, question, answer, page }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            revalidatePath("/");
            revalidatePath("/about-us");
            revalidatePath("/frequently-asked-questions");

            return NextResponse.json({ status: "success", message: "FAQ updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await FaqModel.findOne({ sno });

            if (snoPresent) {
                await FaqModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const newFaq = new FaqModel({ sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1, question, answer, page });

            await newFaq.save({ session });

            await session.commitTransaction();
            session.endSession();

            revalidatePath("/");
            revalidatePath("/about-us");

            return NextResponse.json({ status: "success", message: "FAQ created successfully", data: null, error: null }, { status: 201 });
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

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, searchValue = "" } = Object.fromEntries(searchParams.entries());


        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,

            $or: [
                {
                    question: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    answer: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
            ],
        }

        clearSearch(search);

        const faqs = await FaqModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await FaqModel.find(search).countDocuments();
        const totalData = await FaqModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "FAQs fetched successfully", data: { data: faqs, extra }, error: null }, { status: 200 });

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
            return NextResponse.json({ status: 'error', message: "_id is required", data: null, error: "_id is required" }, { status: 400 });
        }

        const deleted = await FaqModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: 'error', message: "FAQ not found", data: null, error: "FAQ not found" }, { status: 404 });
        }

        await FaqModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        revalidatePath("/");
        revalidatePath("/about-us");
        revalidatePath("/frequently-asked-questions");

        return NextResponse.json({ status: "success", message: "FAQ deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}