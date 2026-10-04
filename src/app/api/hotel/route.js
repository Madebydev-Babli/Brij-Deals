import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { clearSearch, deleteImage, bulkDeleteImages, getErrorMessage, isValidEmail, isValidPhoneNumber, uploadImage } from "@/utility/server-utility";
import { LOCATION_ENUM, RESTAURANT_CATEGORIES_ENUM } from "@/utility/utility-data";
import { HotelModel } from "../../../../backend/models/hotel";
import { OfferModel } from "../../../../backend/models/offer";
import { MenuModel } from "../../../../backend/models/menu";
import { MenuItemModel } from "../../../../backend/models/menuItem";
import { AmenityModel } from "../../../../backend/models/amenity";
import { AttractionModel } from "../../../../backend/models/attraction";
import { GalleryModel } from "../../../../backend/models/gallery";

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

        const { _id, sno, title, slug, category, description, logo, banner, mapLink, location, shortLocation, email, phone, startingPrice, isVeg } = await req.json();
        const maxSno = await HotelModel.findOne({}).sort({ sno: -1 });

        if (!title) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ status: "error", message: "Category is required", data: null, error: "Category is required" }, { status: 400 });
        }

        if (!RESTAURANT_CATEGORIES_ENUM.includes(category)) {
            return NextResponse.json({ status: "error", message: "Invalid category", data: null, error: "Invalid category" }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ status: "error", message: "Description is required", data: null, error: "Description is required" }, { status: 400 });
        }

        if (!logo) {
            return NextResponse.json({ status: "error", message: "Logo is required", data: null, error: "Logo is required" }, { status: 400 });
        }

        if (!banner) {
            return NextResponse.json({ status: "error", message: "Banner is required", data: null, error: "Banner is required" }, { status: 400 });
        }

        if (!location) {
            return NextResponse.json({ status: "error", message: "Location is required", data: null, error: "Location is required" }, { status: 400 });
        }

        if (!shortLocation) {
            return NextResponse.json({ status: "error", message: "Short location is required", data: null, error: "Short location is required" }, { status: 400 });
        }

        if (!LOCATION_ENUM.includes(shortLocation)) {
            return NextResponse.json({ status: "error", message: "Invalid short location", data: null, error: "Invalid short location" }, { status: 400 });
        }

        if (!email) {
            return NextResponse.json({ status: "error", message: "Email is required", data: null, error: "Email is required" }, { status: 400 });
        }

        const checkEmail = isValidEmail(email);
        if (!checkEmail.status) {
            return NextResponse.json({ status: "error", message: checkEmail.message, data: null, error: checkEmail.message }, { status: 400 });
        }

        if (!phone) {
            return NextResponse.json({ status: "error", message: "Phone is required", data: null, error: "Phone is required" }, { status: 400 });
        }

        const checkPhone = isValidPhoneNumber(phone);
        if (!checkPhone.status) {
            return NextResponse.json({ status: "error", message: checkPhone.message, data: null, error: checkPhone.message }, { status: 400 });
        }

        if (!startingPrice) {
            return NextResponse.json({ status: "error", message: "Starting Price is required", data: null, error: "Starting Price is required" }, { status: 400 });
        }

        if (isNaN(Number(startingPrice)) || Number(startingPrice) < 0) {
            return NextResponse.json({ status: "error", message: "Starting prices should be a positive number.", data: null, error: "Starting prices should be a positive number." }, { status: 400 });
        }

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const hotel = await HotelModel.findById(_id);

            if (!hotel) {
                return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
            }

            if (sno < hotel.sno) {
                await HotelModel.updateMany({ sno: { $gte: sno, $lt: hotel.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > hotel.sno) {
                await HotelModel.updateMany({ sno: { $gt: hotel.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            const uploadedLogo = await uploadImage(logo, "braj_deals/hotel/logos", 1024 * 1024 * 1);
            const uploadedBanner = await uploadImage(banner, "braj_deals/hotel/banners", 1024 * 1024 * 2);

            const updatedHotel = await HotelModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    title,
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    category,
                    description,
                    logo: uploadedLogo ? { url: uploadedLogo.secure_url, publicId: uploadedLogo.public_id } : hotel.logo,
                    banner: uploadedBanner ? { url: uploadedBanner.secure_url, publicId: uploadedBanner.public_id } : hotel.banner,
                    mapLink,
                    location,
                    shortLocation,
                    email,
                    phone,
                    startingPrice: Number(startingPrice),
                    isVeg,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            if (uploadedLogo) {
                await deleteImage(hotel.logo.publicId);
            }

            if (uploadedBanner) {
                await deleteImage(hotel.banner.publicId);
            }

            revalidatePath("/categories/hotels-and-stays");
            revalidatePath(`/categories/hotels-and-stays/${updatedHotel?.slug}`);

            return NextResponse.json({ status: "success", message: "Hotel updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await HotelModel.findOne({ sno });

            if (snoPresent) {
                await HotelModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const uploadedLogo = await uploadImage(logo, "braj_deals/hotel/logos", 1024 * 1024 * 1);
            const uploadedBanner = await uploadImage(banner, "braj_deals/hotel/banners", 1024 * 1024 * 2);

            const newHotel = new HotelModel({
                sno: sno ? sno : maxSno?.sno ? maxSno?.sno + 1 : 1,
                title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                category,
                description,
                logo: { url: uploadedLogo.secure_url, publicId: uploadedLogo.public_id },
                banner: { url: uploadedBanner.secure_url, publicId: uploadedBanner.public_id },
                mapLink,
                location,
                shortLocation,
                email,
                phone,
                startingPrice: Number(startingPrice),
                isVeg,
            });

            await newHotel.save({ session });

            await session.commitTransaction();
            session.endSession();

            revalidatePath("/categories/hotels-and-stays");
            revalidatePath(`/categories/hotels-and-stays/${newHotel?.slug}`);

            return NextResponse.json({ status: "success", message: "Hotel added successfully", data: null, error: null }, { status: 201 });
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

        const { _id, sortOrder = -1, sortKey = "createdAt", limit = 10, page = 1, searchValue = "", category, shortLocation } = Object.fromEntries(searchParams.entries());

        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
            category: category ? category : undefined,
            shortLocation: shortLocation ? shortLocation : undefined,

            $or: [
                {
                    title: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    category: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    description: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    location: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    shortLocation: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    email: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                },
                {
                    phone: { '$regex': new RegExp(searchValue || ''), $options: 'i' }
                }
            ],
        }

        clearSearch(search);

        const hotels = await HotelModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await HotelModel.find(search).countDocuments();
        const totalData = await HotelModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Hotels fetched successfully", data: { data: hotels, extra }, error: null }, { status: 200 });

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

        const deleted = await HotelModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
        }

        await HotelModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });
        await OfferModel.deleteMany({ hotelId: _id }, { session });
        await AttractionModel.deleteMany({ hotelId: _id }, { session });
        await AmenityModel.deleteMany({ hotelId: _id }, { session });

        const galleries = await GalleryModel.find({ hotelId: _id });
        const galleriesPublicIds = galleries.map((gallery) => gallery.image.publicId);

        await GalleryModel.deleteMany({ hotelId: _id }, { session });

        await session.commitTransaction();
        session.endSession();

        await bulkDeleteImages([...galleriesPublicIds, deleted.logo.publicId, deleted.banner.publicId]);

        return NextResponse.json({ status: "success", message: "Hotel deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}