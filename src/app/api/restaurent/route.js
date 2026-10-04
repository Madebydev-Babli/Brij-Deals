import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { clearSearch, deleteImage, bulkDeleteImages, getErrorMessage, isValidEmail, isValidPhoneNumber, uploadImage } from "@/utility/server-utility";
import { LOCATION_ENUM, RESTAURANT_CATEGORIES_ENUM } from "@/utility/utility-data";
import { RestaurentModel } from "../../../../backend/models/restaurent";
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

        const { _id, sno, title, slug, category, description, logo, banner, mapLink, location, shortLocation, email, phone, isVeg } = await req.json();
        const maxSno = await RestaurentModel.findOne({}).sort({ sno: -1 });

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

        if (_id) {

            if (!sno) {
                return NextResponse.json({ status: "error", message: "S No is required", data: null, error: "S No is required" }, { status: 400 });
            }

            const restaurent = await RestaurentModel.findById(_id);

            if (!restaurent) {
                return NextResponse.json({ status: "error", message: "Restaurent not found", data: null, error: "Restaurent not found" }, { status: 404 });
            }

            if (sno < restaurent.sno) {
                await RestaurentModel.updateMany({ sno: { $gte: sno, $lt: restaurent.sno } }, { $inc: { sno: 1 } }, { session });
            }

            if (sno > restaurent.sno) {
                await RestaurentModel.updateMany({ sno: { $gt: restaurent.sno, $lte: sno } }, { $inc: { sno: -1 } }, { session });
            }

            const uploadedLogo = await uploadImage(logo, "braj_deals/restaurent/logos", 1024 * 1024 * 1);
            const uploadedBanner = await uploadImage(banner, "braj_deals/restaurent/banners", 1024 * 1024 * 2);

            const updatedRestaurent = await RestaurentModel.findByIdAndUpdate(_id,
                {
                    sno: maxSno.sno >= sno ? sno : maxSno.sno,
                    title,
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    category,
                    description,
                    logo: uploadedLogo ? { url: uploadedLogo.secure_url, publicId: uploadedLogo.public_id } : restaurent.logo,
                    banner: uploadedBanner ? { url: uploadedBanner.secure_url, publicId: uploadedBanner.public_id } : restaurent.banner,
                    mapLink,
                    location,
                    shortLocation,
                    email,
                    phone,
                    isVeg,
                }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            if (uploadedLogo) {
                await deleteImage(restaurent.logo.publicId);
            }

            if (uploadedBanner) {
                await deleteImage(restaurent.banner.publicId);
            }

            revalidatePath("/categories/restaurants");
            revalidatePath(`/categories/restaurants/${updatedRestaurent?.slug}`);

            return NextResponse.json({ status: "success", message: "Restaurent updated successfully", data: null, error: null }, { status: 200 });

        } else {

            const snoPresent = await RestaurentModel.findOne({ sno });

            if (snoPresent) {
                await RestaurentModel.updateMany({ sno: { $gte: sno } }, { $inc: { sno: 1 } }, { session });
            }

            const uploadedLogo = await uploadImage(logo, "braj_deals/restaurent/logos", 1024 * 1024 * 1);
            const uploadedBanner = await uploadImage(banner, "braj_deals/restaurent/banners", 1024 * 1024 * 2);

            const newRestaurent = new RestaurentModel({
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
                isVeg,
            });

            await newRestaurent.save({ session });

            await session.commitTransaction();
            session.endSession();

            revalidatePath("/categories/restaurants");
            revalidatePath(`/categories/restaurants/${newRestaurent?.slug}`);

            return NextResponse.json({ status: "success", message: "Restaurent added successfully", data: null, error: null }, { status: 201 });
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

        const restaurents = await RestaurentModel.find(search).skip((Number(page) - 1) * Number(limit)).limit(limit).sort({ [sortKey]: Number(sortOrder) }).lean();

        const totalFilteredData = await RestaurentModel.find(search).countDocuments();
        const totalData = await RestaurentModel.find({}).countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(Math.ceil(totalFilteredData / limit))
        };

        return NextResponse.json({ status: "success", message: "Restaurents fetched successfully", data: { data: restaurents, extra }, error: null }, { status: 200 });

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

        const deleted = await RestaurentModel.findByIdAndDelete(_id, { session });

        if (!deleted) {
            return NextResponse.json({ status: "error", message: "Restaurent not found", data: null, error: "Restaurent not found" }, { status: 404 });
        }

        await RestaurentModel.updateMany({ sno: { $gt: deleted.sno } }, { $inc: { sno: -1 } }, { session });

        await OfferModel.deleteMany({ restaurentId: _id }, { session });
        await MenuModel.deleteMany({ restaurentId: _id }, { session });
        await MenuItemModel.deleteMany({ restaurentId: _id }, { session });
        await AttractionModel.deleteMany({ restaurentId: _id }, { session });

        await AmenityModel.deleteMany({ restaurentId: _id }, { session });

        const galleries = await GalleryModel.find({ restaurentId: _id });
        const galleriesPublicIds = galleries.map((gallery) => gallery.image.publicId);

        await GalleryModel.deleteMany({ restaurentId: _id }, { session });

        await session.commitTransaction();
        session.endSession();

        await bulkDeleteImages([...galleriesPublicIds, deleted.logo.publicId, deleted.banner.publicId]);

        return NextResponse.json({ status: "success", message: "Restaurent deleted successfully", data: null, error: null }, { status: 200 });

    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    }
}