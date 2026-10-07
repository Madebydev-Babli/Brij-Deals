import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { BannerModel } from "../../../../backend/models/banner";
import { clearSearch, deleteImage, getErrorMessage, uploadImage } from "@/utility/server-utility";

export async function POST(req) {
    let session = null;

    try {
        await connectToDatabase();

        // Verify authentication before starting transaction
        const decoded = await verifyToken(req);

        if (!decoded) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Unauthorized access",
                    data: null,
                    error: "Unauthorized access",
                },
                { status: 401 }
            );
        }

        const {
            _id,
            sno,
            title,
            description,
            link,
            button,
            image,
        } = await req.json();
        
        // Validate data BEFORE starting transaction
        if (!title) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Title is required",
                    data: null,
                    error: "Title is required",
                },
                { status: 400 }
            );
        }

        if (!link) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Link is required",
                    data: null,
                    error: "Link is required",
                },
                { status: 400 }
            );
        }

        if (!button) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Button is required",
                    data: null,
                    error: "Button is required",
                },
                { status: 400 }
            );
        }

        if (!image) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Image is required",
                    data: null,
                    error: "Image is required",
                },
                { status: 400 }
            );
        }

        if (!description) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Description is required",
                    data: null,
                    error: "Description is required",
                },
                { status: 400 }
            );
        }

        // Start transaction only after validation
        session = await mongoose.startSession();
        session.startTransaction();

        const maxSno = await BannerModel.findOne({})
            .sort({ sno: -1 })
            .session(session);

        if (_id) {
            if (!sno) {
                await session.abortTransaction();
                session.endSession();

                return NextResponse.json(
                    {
                        status: "error",
                        message: "S No is required",
                        data: null,
                        error: "S No is required",
                    },
                    { status: 400 }
                );
            }

            const banner = await BannerModel.findById(_id).session(session);

            if (!banner) {
                await session.abortTransaction();
                session.endSession();

                return NextResponse.json(
                    {
                        status: "error",
                        message: "Banner not found",
                        data: null,
                        error: "Banner not found",
                    },
                    { status: 404 }
                );
            }

            if (sno < banner.sno) {
                await BannerModel.updateMany(
                    {
                        sno: {
                            $gte: sno,
                            $lt: banner.sno,
                        },
                    },
                    {
                        $inc: { sno: 1 },
                    },
                    { session }
                );
            }

            if (sno > banner.sno) {
                await BannerModel.updateMany(
                    {
                        sno: {
                            $gt: banner.sno,
                            $lte: sno,
                        },
                    },
                    {
                        $inc: { sno: -1 },
                    },
                    { session }
                );
            }

            const uploadedImage = image && image.data
    ? await uploadImage(
        image.data,
        "braj_deals/banners",
        1024 * 1024 * 2
    )
    : null;

            if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
    throw new Error("Banner image upload failed");
}

            await BannerModel.findByIdAndUpdate(
                _id,
                {
                    sno: maxSno?.sno >= sno ? sno : maxSno?.sno || sno,
                    title,
                    link,
                    button,
                    image: {
                        url: uploadedImage.secure_url,
                        publicId: uploadedImage.public_id,
                    },
                    description,
                },
                {
                    new: true,
                    session,
                }
            );

            await session.commitTransaction();
            session.endSession();

            if (banner.image?.publicId) {
                await deleteImage(banner.image.publicId);
            }

            revalidatePath("/");

            return NextResponse.json(
                {
                    status: "success",
                    message: "Banner updated successfully",
                    data: null,
                    error: null,
                },
                { status: 200 }
            );
        }

        // CREATE

        const snoPresent = await BannerModel.findOne({ sno }).session(session);

        if (snoPresent) {
            await BannerModel.updateMany(
                {
                    sno: { $gte: sno },
                },
                {
                    $inc: { sno: 1 },
                },
                { session }
            );
        }

        const uploadedImage = image && image.data
    ? await uploadImage(
        image.data,
        "braj_deals/banners",
        1024 * 1024 * 2
    )
    : null;

        if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
    throw new Error("Banner image upload failed");
}

        const newBanner = new BannerModel({
            sno: sno
                ? sno
                : maxSno?.sno
                    ? maxSno.sno + 1
                    : 1,
            title,
            link,
            button,
            image: {
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
            },
            description,
        });

        await newBanner.save({ session });

        await session.commitTransaction();
        session.endSession();

        revalidatePath("/");

        return NextResponse.json(
            {
                status: "success",
                message: "Banner added successfully",
                data: null,
                error: null,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("BANNER POST ERROR:", error);

        if (session) {
            try {
                await session.abortTransaction();
                session.endSession();
            } catch (sessionError) {
                console.error("SESSION ERROR:", sessionError);
            }
        }

        const errorMessage = await getErrorMessage(error);

        return NextResponse.json(
            {
                status: "error",
                data: null,
                message: errorMessage,
                error: errorMessage,
            },
            { status: 500 }
        );
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
                    title: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    link: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    button: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    description: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
            ],
        }

        clearSearch(search);

        const banner = await BannerModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await BannerModel.find(search).countDocuments();
        const totalData = await BannerModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json(
            {
                status: "success",
                message: "Banners fetched successfully",
                data: {
                    data: banner.map((item) => ({
                        ...item,
                        image: item.image.url
                    })),
                    extra
                },
                error: null
            },
            {
                status: 200
            }
        );

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

        const deleted = await BannerModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Banner not found", data: null, error: "Banner not found" }, { status: 404 });
        }

        await BannerModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        await deleteImage(deleted.image.publicId);

        revalidatePath("/");

        return NextResponse.json({ status: "success", message: "Banner deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}