import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { HotelModel } from "../../../../backend/models/hotel";
import { bulkDeleteImages, clearSearch, deleteImage, getErrorMessage, uploadImage } from "@/utility/server-utility";
import { revalidatePath } from "next/cache";

function createSlug(title) {
    return title
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "";
}

function normalizeUploadedImage(uploadedImage) {
    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) return null;
    return { url: uploadedImage.secure_url, publicId: uploadedImage.public_id };
}

function normalizeExistingImage(image) {
    if (!image) return null;
    if (typeof image === "string") {
        return { url: image, publicId: "" };
    }
    if (image?.url) {
        return { url: image.url, publicId: image.publicId || "" };
    }
    return null;
}

function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function normalizeOffers(offers) {
    if (!Array.isArray(offers)) throw Object.assign(new Error("Offers must be an array"), { statusCode: 400 });
    return offers.map((offer) => ({
        title: offer.title?.trim() || "",
        description: offer.description?.trim() || "",
        endDate: offer.endDate?.trim() || "",
    }));
}

function normalizeAmenities(amenities) {
    if (!Array.isArray(amenities)) throw Object.assign(new Error("Amenities must be an array"), { statusCode: 400 });
    return amenities
        .map((amenity) => ({
            name: amenity.name?.trim() || amenity.title?.trim() || "",
            icon: amenity.icon?.toString().trim() || "",
        }))
        .filter((amenity) => amenity.name);
}

function normalizeAttractions(attractions) {
    if (!Array.isArray(attractions)) throw Object.assign(new Error("Attractions must be an array"), { statusCode: 400 });
    return attractions.map((attraction) => ({
        title: attraction.title?.trim() || "",
        distance: attraction.distance?.trim() || "",
        time: attraction.time?.trim() || "",
        mode: attraction.mode?.trim() || "",
    }));
}

async function uploadSingleImage(imageData, folder, maxSize = 1024 * 1024 * 2) {
    if (!imageData?.data) return null;
    const uploaded = await uploadImage(imageData.data, folder, maxSize);
    const normalized = normalizeUploadedImage(uploaded);

    if (!normalized) {
        const error = new Error(uploaded?.message || "Image upload failed");
        if (uploaded?.status === false) error.statusCode = 400;
        throw error;
    }

    return normalized;
}

async function normalizeHotelGallery(gallery = []) {
    if (!Array.isArray(gallery)) return [];
    const normalized = [];

    for (const item of gallery) {
        if (!item) continue;

        if (item.image?.data) {
            const uploaded = await uploadSingleImage(item.image, "braj_deals/hotels/gallery");
            if (uploaded) {
                normalized.push({
                    image: uploaded,
                    label: item.label?.trim() || "",
                });
            }
            continue;
        }

        const existingImage = normalizeExistingImage(item.image);
        if (existingImage) {
            normalized.push({
                image: existingImage,
                label: item.label?.trim() || "",
            });
        }
    }

    return normalized;
}

async function normalizeRoomCategories(roomCategories = []) {
    if (!Array.isArray(roomCategories)) return [];
    const normalized = [];

    for (const room of roomCategories) {
        if (!room) continue;

        let heroImage = normalizeExistingImage(room.heroImage);
        if (room.heroImage?.data) {
            heroImage = await uploadSingleImage(room.heroImage, "braj_deals/hotels/room-hero");
        }

        const gallery = await normalizeHotelGallery(Array.isArray(room.gallery) ? room.gallery : []);

        normalized.push({
            _id: room._id || undefined,
            title: room.title?.trim() || "",
            description: room.description?.trim() || "",
            heroImage,
            gallery,
            size: room.size?.trim() || "",
            bedType: room.bedType?.trim() || "",
            bedQuantity: Number(room.bedQuantity) || 1,
            guests: Number(room.guests) || 1,
            price: room.price?.toString().trim() || "",
            amenities: Array.isArray(room.amenities)
                ? room.amenities.map((item) => typeof item === "string" ? item : item?.name || item?.title || "").filter(Boolean)
                : [],
        });
    }

    return normalized;
}

function collectPublicIdsFromHotel(hotel) {
    const ids = [];

    if (hotel?.image?.publicId) ids.push(hotel.image.publicId);
    if (hotel?.logo?.publicId) ids.push(hotel.logo.publicId);
    if (hotel?.banner?.publicId) ids.push(hotel.banner.publicId);

    for (const room of hotel?.roomCategories || []) {
        if (room?.heroImage?.publicId) ids.push(room.heroImage.publicId);
        for (const roomImage of room?.gallery || []) {
            if (roomImage?.image?.publicId) ids.push(roomImage.image.publicId);
        }
    }

    for (const item of hotel?.gallery || []) {
        if (item?.image?.publicId) ids.push(item.image.publicId);
    }

    return ids.filter(Boolean);
}

export async function POST(req) {
    let session = null;

    try {
        await connectToDatabase();
        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);
        if (!decoded) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const body = await req.json();
        const {
            _id,
            sno,
            title,
            slug: receivedSlug,
            description,
            image,
            logo,
            banner,
            location,
            shortLocation,
            mapLink,
            openingTime,
            closingTime,
            email,
            phone,
            whatsapp,
            instagram,
            facebook,
            youtube,
            website,
            rating,
            reviewCount,
            googleReview,
            startingPrice,
            roomCategories = [],
            offers = [],
            amenities = [],
            attractions = [],
            gallery = [],
        } = body;

        if (!title?.trim()) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (!description?.trim()) {
            return NextResponse.json({ status: "error", message: "Description is required", data: null, error: "Description is required" }, { status: 400 });
        }

        if (!location?.trim()) {
            return NextResponse.json({ status: "error", message: "Location is required", data: null, error: "Location is required" }, { status: 400 });
        }

        if (!shortLocation?.trim()) {
            return NextResponse.json({ status: "error", message: "Short location is required", data: null, error: "Short location is required" }, { status: 400 });
        }

        if (!startingPrice && startingPrice !== 0) {
            return NextResponse.json({ status: "error", message: "Starting Price is required", data: null, error: "Starting Price is required" }, { status: 400 });
        }

        if (!Number.isFinite(Number(startingPrice)) || Number(startingPrice) < 0) {
            return NextResponse.json({ status: "error", message: "Starting Price must be a valid positive number", data: null, error: "Starting Price must be a valid positive number" }, { status: 400 });
        }

        const generatedSlug = createSlug(title) || createSlug(receivedSlug);
        if (!generatedSlug) {
            return NextResponse.json({ status: "error", message: "Valid title or slug is required", data: null, error: "Valid title or slug is required" }, { status: 400 });
        }

        const lastHotel = await HotelModel.findOne({}).sort({ sno: -1 }).select("sno").session(session);
        const maxSno = lastHotel?.sno || 0;

        if (_id) {
            const existingHotel = await HotelModel.findById(_id).session(session);
            if (!existingHotel) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
            }

            const duplicateSlug = await HotelModel.findOne({ slug: generatedSlug, _id: { $ne: _id } }).session(session);
            if (duplicateSlug) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "A hotel with this slug already exists", data: null, error: "A hotel with this slug already exists" }, { status: 409 });
            }

            let updatedSno = existingHotel.sno;
            if (sno !== undefined && sno !== null && sno !== "") {
                updatedSno = Number(sno);
                if (!Number.isInteger(updatedSno) || updatedSno < 1) {
                    await session.abortTransaction();
                    return NextResponse.json({ status: "error", message: "Invalid serial number", data: null, error: "Invalid serial number" }, { status: 400 });
                }

                if (updatedSno !== existingHotel.sno) {
                    if (updatedSno < existingHotel.sno) {
                        await HotelModel.updateMany({ sno: { $gte: updatedSno, $lt: existingHotel.sno, _id: { $ne: _id } } }, { $inc: { sno: 1 } }).session(session);
                    } else {
                        await HotelModel.updateMany({ sno: { $gt: existingHotel.sno, $lte: updatedSno, _id: { $ne: _id } } }, { $inc: { sno: -1 } }).session(session);
                    }
                }
            }

            let updatedImage = existingHotel.image;
            if (image?.data) {
                const uploadedImage = await uploadSingleImage(image, "braj_deals/hotels");
                if (uploadedImage) {
                    updatedImage = uploadedImage;
                }
            }

            let updatedLogo = existingHotel.logo;
            if (logo?.data) {
                const uploadedLogo = await uploadSingleImage(logo, "braj_deals/hotels/logos");
                if (uploadedLogo) {
                    updatedLogo = uploadedLogo;
                }
            }

            let updatedBanner = existingHotel.banner;
            if (banner?.data) {
                const uploadedBanner = await uploadSingleImage(banner, "braj_deals/hotels/banners");
                if (uploadedBanner) {
                    updatedBanner = uploadedBanner;
                }
            }

            const previousPublicIds = new Set(collectPublicIdsFromHotel(existingHotel));
            const normalizedRoomCategories = hasOwn(body, "roomCategories") ? await normalizeRoomCategories(roomCategories) : undefined;
            const normalizedGallery = hasOwn(body, "gallery") ? await normalizeHotelGallery(gallery) : undefined;
            const normalizedOffers = hasOwn(body, "offers") ? normalizeOffers(offers) : undefined;
            const normalizedAmenities = hasOwn(body, "amenities") ? normalizeAmenities(amenities) : undefined;
            const normalizedAttractions = hasOwn(body, "attractions") ? normalizeAttractions(attractions) : undefined;

            existingHotel.sno = updatedSno;
            existingHotel.slug = generatedSlug;
            existingHotel.title = title.trim();
            existingHotel.description = description.trim();
            existingHotel.image = updatedImage;
            existingHotel.logo = updatedLogo;
            existingHotel.banner = updatedBanner;
            existingHotel.location = location.trim();
            existingHotel.shortLocation = shortLocation.trim();
            if (hasOwn(body, "mapLink")) existingHotel.mapLink = mapLink?.trim() || "";
            if (hasOwn(body, "openingTime")) existingHotel.openingTime = openingTime?.trim() || "";
            if (hasOwn(body, "closingTime")) existingHotel.closingTime = closingTime?.trim() || "";
            if (hasOwn(body, "email")) existingHotel.email = email?.trim() || "";
            if (hasOwn(body, "phone")) existingHotel.phone = phone?.trim() || "";
            if (hasOwn(body, "whatsapp")) existingHotel.whatsapp = whatsapp?.trim() || "";
            if (hasOwn(body, "instagram")) existingHotel.instagram = instagram?.trim() || "";
            if (hasOwn(body, "facebook")) existingHotel.facebook = facebook?.trim() || "";
            if (hasOwn(body, "youtube")) existingHotel.youtube = youtube?.trim() || "";
            if (hasOwn(body, "website")) existingHotel.website = website?.trim() || "";
            if (hasOwn(body, "rating")) existingHotel.rating = Number(rating) || 0;
            if (hasOwn(body, "reviewCount")) existingHotel.reviewCount = Number(reviewCount) || 0;
            if (hasOwn(body, "googleReview")) existingHotel.googleReview = googleReview?.trim() || "";
            existingHotel.startingPrice = Number(startingPrice);
            if (normalizedRoomCategories) existingHotel.roomCategories = normalizedRoomCategories;
            if (normalizedOffers) existingHotel.offers = normalizedOffers;
            if (normalizedAmenities) existingHotel.amenities = normalizedAmenities;
            if (normalizedAttractions) existingHotel.attractions = normalizedAttractions;
            if (normalizedGallery) existingHotel.gallery = normalizedGallery;

            await existingHotel.save({ session });
            await session.commitTransaction();

            const submittedPublicIds = new Set(collectPublicIdsFromHotel(existingHotel));
            for (const publicId of previousPublicIds) {
                if (!submittedPublicIds.has(publicId)) {
                    try { await deleteImage(publicId); } catch (error) { console.error("Failed to delete stale hotel image:", error); }
                }
            }

            revalidatePath("/categories/hotels-and-stays");
            revalidatePath(`/categories/hotels-and-stays/${generatedSlug}`);
            return NextResponse.json({ status: "success", message: "Hotel updated successfully", data: { data: [existingHotel] }, error: null }, { status: 200 });
        }

        const duplicateSlug = await HotelModel.findOne({ slug: generatedSlug }).session(session);
        if (duplicateSlug) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "A hotel with this slug already exists", data: null, error: "A hotel with this slug already exists" }, { status: 409 });
        }

        let newSno = maxSno + 1;
        if (sno !== undefined && sno !== null && sno !== "") {
            newSno = Number(sno);
            if (!Number.isInteger(newSno) || newSno < 1) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "Invalid serial number", data: null, error: "Invalid serial number" }, { status: 400 });
            }
            if (newSno <= maxSno) {
                await HotelModel.updateMany({ sno: { $gte: newSno } }, { $inc: { sno: 1 } }).session(session);
            }
        }

        if (!image?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Hotel image is required", data: null, error: "Hotel image is required" }, { status: 400 });
        }

        if (!logo?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Hotel logo is required", data: null, error: "Hotel logo is required" }, { status: 400 });
        }

        if (!banner?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Hotel banner is required", data: null, error: "Hotel banner is required" }, { status: 400 });
        }

        const uploadedImage = await uploadSingleImage(image, "braj_deals/hotels");
        const uploadedLogo = await uploadSingleImage(logo, "braj_deals/hotels/logos");
        const uploadedBanner = await uploadSingleImage(banner, "braj_deals/hotels/banners");
        const roomCategoriesPayload = await normalizeRoomCategories(roomCategories);
        const galleryPayload = await normalizeHotelGallery(gallery);
        const offersPayload = normalizeOffers(offers);
        const amenitiesPayload = normalizeAmenities(amenities);
        const attractionsPayload = normalizeAttractions(attractions);

        if (!uploadedImage || !uploadedLogo || !uploadedBanner) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Image upload failed", data: null, error: "Image upload failed" }, { status: 500 });
        }

        const newHotel = new HotelModel({
            sno: newSno,
            slug: generatedSlug,
            title: title.trim(),
            description: description.trim(),
            image: uploadedImage,
            logo: uploadedLogo,
            banner: uploadedBanner,
            location: location.trim(),
            shortLocation: shortLocation.trim(),
            mapLink: mapLink?.trim() || "",
            openingTime: openingTime?.trim() || "",
            closingTime: closingTime?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
            whatsapp: whatsapp?.trim() || "",
            instagram: instagram?.trim() || "",
            facebook: facebook?.trim() || "",
            youtube: youtube?.trim() || "",
            website: website?.trim() || "",
            rating: Number(rating) || 0,
            reviewCount: Number(reviewCount) || 0,
            googleReview: googleReview?.trim() || "",
            startingPrice: Number(startingPrice),
            roomCategories: roomCategoriesPayload,
            offers: offersPayload,
            amenities: amenitiesPayload,
            attractions: attractionsPayload,
            gallery: galleryPayload,
        });

        await newHotel.save({ session });
        await session.commitTransaction();

        revalidatePath("/categories/hotels-and-stays");
        revalidatePath(`/categories/hotels-and-stays/${generatedSlug}`);

        return NextResponse.json({ status: "success", message: "Hotel added successfully", data: { data: [newHotel] }, error: null }, { status: 201 });
    } catch (error) {
        try {
            if (session) await session.abortTransaction();
        } catch (abortError) {
            console.error("Hotel transaction abort failed:", abortError);
        }

        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: error.statusCode || 500 });
    } finally {
        if (session) session.endSession();
    }
}

export async function PATCH(req) {
    let session = null;

    try {
        await connectToDatabase();
        session = await mongoose.startSession();
        session.startTransaction();

        const decoded = await verifyToken(req);
        if (!decoded) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const body = await req.json();
        const { _id } = body;
        const fields = ["instagram", "facebook", "youtube", "website", "offers", "roomCategories", "amenities", "attractions", "gallery"];
        const submittedFields = fields.filter((field) => hasOwn(body, field));

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Valid Hotel ID is required", data: null, error: "Valid Hotel ID is required" }, { status: 400 });
        }

        if (!submittedFields.length || Object.keys(body).some((field) => field !== "_id" && !fields.includes(field))) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Invalid Hotel section update", data: null, error: "Invalid Hotel section update" }, { status: 400 });
        }

        for (const field of ["instagram", "facebook", "youtube", "website"]) {
            if (hasOwn(body, field) && typeof body[field] !== "string") {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: `${field} must be a string`, data: null, error: `${field} must be a string` }, { status: 400 });
            }
        }

        for (const field of ["offers", "roomCategories", "amenities", "attractions", "gallery"]) {
            if (hasOwn(body, field) && !Array.isArray(body[field])) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: `${field} must be an array`, data: null, error: `${field} must be an array` }, { status: 400 });
            }
        }

        const hotel = await HotelModel.findById(_id).session(session);
        if (!hotel) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
        }

        const previousPublicIds = new Set(collectPublicIdsFromHotel(hotel));

        for (const field of ["instagram", "facebook", "youtube", "website"]) {
            if (hasOwn(body, field)) hotel[field] = body[field]?.trim() || "";
        }

        if (hasOwn(body, "offers")) hotel.offers = normalizeOffers(body.offers);
        if (hasOwn(body, "roomCategories")) hotel.roomCategories = await normalizeRoomCategories(body.roomCategories);
        if (hasOwn(body, "amenities")) hotel.amenities = normalizeAmenities(body.amenities);
        if (hasOwn(body, "attractions")) hotel.attractions = normalizeAttractions(body.attractions);
        if (hasOwn(body, "gallery")) hotel.gallery = await normalizeHotelGallery(body.gallery);

        await hotel.save({ session });
        await session.commitTransaction();

        const submittedPublicIds = new Set(collectPublicIdsFromHotel(hotel));
        for (const publicId of previousPublicIds) {
            if (!submittedPublicIds.has(publicId)) {
                try {
                    await deleteImage(publicId);
                } catch (error) {
                    console.error("Failed to delete stale hotel image:", error);
                }
            }
        }

        revalidatePath("/categories/hotels-and-stays");
        revalidatePath(`/categories/hotels-and-stays/${hotel.slug}`);
        return NextResponse.json({ status: "success", message: "Hotel section updated successfully", data: { data: [hotel] }, error: null }, { status: 200 });
    } catch (error) {
        try {
            if (session) await session.abortTransaction();
        } catch (abortError) {
            console.error("Hotel section update abort failed:", abortError);
        }

        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: error.statusCode || 500 });
    } finally {
        if (session) session.endSession();
    }
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("_id");
        const slug = searchParams.get("slug");
        const sortOrder = Number(searchParams.get("sortOrder")) || -1;
        const sortKey = searchParams.get("sortKey") || "createdAt";
        const limit = Number(searchParams.get("limit")) || 10;
        const page = Number(searchParams.get("page")) || 1;
        const searchValue = searchParams.get("searchValue") || "";
        const shortLocation = searchParams.get("shortLocation") || "";

        if (_id) {
            const hotel = await HotelModel.findById(_id).lean();
            if (!hotel) {
                return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", message: "Hotel fetched successfully", data: { data: [hotel] }, error: null }, { status: 200 });
        }

        if (slug) {
            const hotel = await HotelModel.findOne({ slug }).lean();
            if (!hotel) {
                return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", message: "Hotel fetched successfully", data: { data: [hotel] }, error: null }, { status: 200 });
        }

        const cleanSearchValue = clearSearch(searchValue);
        const cleanShortLocation = clearSearch(shortLocation);

        const searchQuery = {
            ...(cleanSearchValue ? {
                $or: [
                    { title: { $regex: cleanSearchValue, $options: "i" } },
                    { description: { $regex: cleanSearchValue, $options: "i" } },
                    { location: { $regex: cleanSearchValue, $options: "i" } },
                    { shortLocation: { $regex: cleanSearchValue, $options: "i" } },
                    { email: { $regex: cleanSearchValue, $options: "i" } },
                    { phone: { $regex: cleanSearchValue, $options: "i" } },
                    { whatsapp: { $regex: cleanSearchValue, $options: "i" } },
                    { slug: { $regex: cleanSearchValue, $options: "i" } },
                ],
            } : {}),
            ...(cleanShortLocation ? { shortLocation: { $regex: cleanShortLocation, $options: "i" } } : {}),
        };

        const totalData = await HotelModel.countDocuments();
        const totalFilteredData = await HotelModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalFilteredData / limit) || 1;
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const skip = (currentPage - 1) * limit;

        const hotels = await HotelModel.find(searchQuery)
            .sort({ [sortKey]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            status: "success",
            message: "Hotels fetched successfully",
            data: {
                data: hotels,
                extra: {
                    page: currentPage,
                    limit,
                    totalData,
                    totalFilteredData,
                    totalPages,
                },
            },
            error: null,
        }, { status: 200 });
    } catch (error) {
        console.error("Hotel GET API Error:", error);
        return NextResponse.json({ status: "error", message: await getErrorMessage(error), data: null, error: await getErrorMessage(error) }, { status: 500 });
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
            return NextResponse.json({ status: "error", message: "Unauthorized access", data: null, error: "Unauthorized access" }, { status: 401 });
        }

        const { _id } = await req.json();
        if (!_id) {
            return NextResponse.json({ status: "error", message: "Hotel ID is required", data: null, error: "Hotel ID is required" }, { status: 400 });
        }

        const hotel = await HotelModel.findById(_id).session(session);
        if (!hotel) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Hotel not found", data: null, error: "Hotel not found" }, { status: 404 });
        }

        const publicIds = collectPublicIdsFromHotel(hotel);
        await HotelModel.findByIdAndDelete(_id, { session });
        await HotelModel.updateMany({ sno: { $gt: hotel.sno } }, { $inc: { sno: -1 } }).session(session);
        await session.commitTransaction();

        if (publicIds.length) {
            await bulkDeleteImages(publicIds);
        }

        revalidatePath("/categories/hotels-and-stays");
        return NextResponse.json({ status: "success", message: "Hotel deleted successfully", data: null, error: null }, { status: 200 });
    } catch (error) {
        try { if (session) await session.abortTransaction(); } catch (abortError) { console.error("Hotel delete abort failed:", abortError); }
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    } finally {
        if (session) session.endSession();
    }
}