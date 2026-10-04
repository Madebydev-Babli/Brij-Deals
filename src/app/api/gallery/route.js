import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { clearSearch, deleteImage, getErrorMessage, uploadImage } from "@/utility/server-utility";
import { GalleryModel } from "../../../../backend/models/gallery";
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

        const { _id, restaurentId, sno, title, image } = await req.json();
        const maxSno = await GalleryModel.findOne({ restaurentId }).sort({ sno: -1 });

        if (restaurentId) {

            const restaurent = await RestaurentModel.findById(restaurentId);

            if (!restaurent) {
                return NextResponse.json({ status: "error", message: "Restaurent not found", data: null, error: "Restaurent not found" }, { status: 404 });
            }
        }

        if (!title) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (!image) {
            return NextResponse.json({ status: "error", message: "Image is required", data: null, error: "Image is required" }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const amenity = await GalleryModel.findById(_id);

            if (!amenity) {
                return NextResponse.json({ status: "error", message: "Amenity not found", data: null, error: "Amenity not found" }, { status: 404 });
            }

            if (sno < amenity.sno) {
                await GalleryModel.updateMany({ sno: { $gte: sno, $lt: amenity.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > amenity.sno) {
                await GalleryModel.updateMany({ sno: { $gt: amenity.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            const uploadedImage = await uploadImage(image, "braj_deals/gallery", 1024 * 1024 * 1);

            if (uploadedImage && uploadedImage.status === false) {
                return NextResponse.json({ status: "error", message: uploadedImage.message, data: null, error: uploadedImage.message }, { status: 400 });
            }

            await GalleryModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    title,
                    image: (uploadedImage && uploadedImage.secure_url) ? { url: uploadedImage.secure_url, publicId: uploadedImage.public_id } : amenity.image,
                }, { new: true, session }
            );

            await session.commitTransaction();
            session.endSession();

            if (uploadedImage && uploadedImage.secure_url) {
                await deleteImage(amenity.image.publicId);
            }

            return NextResponse.json({ status: "success", message: "Image updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await GalleryModel.findOne({ sno });

            if (snoPresent) {
                await GalleryModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const uploadedImage = await uploadImage(image, "braj_deals/gallery", 1024 * 1024 * 1);

            if (uploadedImage && uploadedImage.status === false) {
                return NextResponse.json({ status: "error", message: uploadedImage.message, data: null, error: uploadedImage.message }, { status: 400 });
            }

            if (!uploadedImage || !uploadedImage.secure_url) {
                return NextResponse.json({ status: "error", message: "Invalid image format", data: null, error: "Invalid image format" }, { status: 400 });
            }

            const newImage = new GalleryModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                restaurentId,
                title,
                image: { url: uploadedImage.secure_url, publicId: uploadedImage.public_id },
            });

            await newImage.save({ session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ status: "success", message: "Image added successfully", data: null, error: null }, { status: 201 });
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
                }
            ],
        }

        clearSearch(search);

        const images = await GalleryModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await GalleryModel.find(search).countDocuments();
        const totalData = await GalleryModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Images fetched successfully", data: { data: images, extra }, error: null }, { status: 200 });

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

        const deleted = await GalleryModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Image not found", data: null, error: "Image not found" }, { status: 404 });
        }

        await GalleryModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        await deleteImage(deleted.image.publicId);

        return NextResponse.json({ status: "success", message: "Image deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}