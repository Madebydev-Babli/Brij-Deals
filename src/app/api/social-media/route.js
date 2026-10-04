import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, getErrorMessage } from "@/utility/server-utility";
import { RestaurentModel } from "../../../../backend/models/restaurent";
import { SocialMediaModel } from "../../../../backend/models/socialMedia";

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

        const { _id, restaurentId, whatsApp, instagram, facebook, youtube, website, googleReviewLink } = await req.json();

        const restaurant = await RestaurentModel.findById(restaurentId);

        if (!restaurant) {
            return NextResponse.json({ status: "error", message: "Restaurant not found", data: null, error: "Restaurant not found" }, { status: 404 });
        }

        if (_id) {

            const socialMedia = await SocialMediaModel.findById(_id);

            if (!socialMedia) {
                return NextResponse.json({ status: "error", message: "Social Media not found", data: null, error: "Social Media not found" }, { status: 404 });
            }

            await SocialMediaModel.findByIdAndUpdate(_id,
                {
                    restaurentId,
                    whatsApp,
                    instagram,
                    facebook,
                    youtube,
                    website,
                    googleReviewLink,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Social media updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const newSocialMedia = new SocialMediaModel({
                restaurentId,
                whatsApp,
                instagram,
                facebook,
                youtube,
                website,
                googleReviewLink,
            });

            await newSocialMedia.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Social media added successfully", data: null, error: null }, { status: 201 });
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
                    whatsApp: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    instagram: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    facebook: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    youtube: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    website: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    googleReviewLink: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
            ],
        }

        clearSearch(search);

        const socialMedia = await SocialMediaModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await SocialMediaModel.find(search).countDocuments();
        const totalData = await SocialMediaModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Social media fetched successfully", data: { data: socialMedia, extra }, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}

// export async function DELETE(req) {

//     let session = null;

//     try {

//         await connectToDatabase();

//         session = await mongoose.startSession();
//         session.startTransaction();

//         const decoded = await verifyToken(req);

//         if (!decoded) {
//             return NextResponse.json({ status: 'error', message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
//         }

//         const { _id } = await req.json();

//         if (!_id) {
//             return NextResponse.json({ status: "error", message: "_id is required", data: null, error: "_id is required" }, { status: 400 });
//         }

//         await SocialMediaModel.findByIdAndDelete(_id, { session });

//         await session.commitTransaction();
//         session.endSession();

//         return NextResponse.json({ status: "success", message: "Social media deleted successfully", data: null, error: null }, { status: 200 });

//     } catch (error) {
//         const errorMessage = await getErrorMessage(error, session);
//         return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
//     }
// }