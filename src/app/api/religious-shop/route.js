import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { ReligiousShopModel } from "../../../../backend/models/religiousShop";
import { bulkDeleteImages, deleteImage, getErrorMessage, uploadImage } from "@/utility/server-utility";
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

function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function isPositiveInteger(value) {
    return (
        (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) &&
        Number.isInteger(Number(value)) &&
        Number(value) > 0
    );
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

async function uploadSingleImage(imageData, folder, maxSize = 5 * 1024 * 1024) {
    if (!imageData?.data) return null;
    const uploaded = await uploadImage(imageData.data, folder, maxSize);
    return normalizeUploadedImage(uploaded);
}

async function normalizeProducts(products = []) {
    if (!Array.isArray(products)) return [];
    const normalized = [];

    for (const item of products) {
        if (!item) continue;

        let productImage = normalizeExistingImage(item.image);
        if (item.image?.data) {
            productImage = await uploadSingleImage(item.image, "braj_deals/religious-shops/products");
        }

        normalized.push({
            _id: item._id || undefined,
            ...(item.sno !== undefined && item.sno !== null && item.sno !== ""
                ? { sno: Number(item.sno) }
                : {}),
            title: item.title?.trim() || "",
            description: item.description?.trim() || "",
            price: item.price?.toString().trim() || "",
            originalPrice: item.originalPrice?.toString().trim() || "",
            offer: item.offer?.toString().trim() || "",
            image: productImage,
            highlights: Array.isArray(item.highlights)
                ? item.highlights.map((highlight) => highlight?.toString().trim()).filter(Boolean)
                : [],
        });
    }

    return normalized;
}

function normalizeAttractions(attractions = []) {
    if (!Array.isArray(attractions)) return [];

    return attractions.map((item) => ({
        ...(item?.sno !== undefined && item.sno !== null && item.sno !== ""
            ? { sno: Number(item.sno) }
            : {}),
        title: item?.title?.trim() || "",
        distance: item?.distance?.trim() || "",
        time: item?.time?.trim() || "",
        mode: item?.mode?.trim() || "",
    })).filter((item) => item.title || item.distance || item.time || item.mode);
}

function validateNestedSerialNumbers(label, records) {
    if (!Array.isArray(records)) return `${label} must be a list`;
    const serialNumbers = new Set();
    for (const record of records) {
        if (record?.sno === undefined || record.sno === null || record.sno === "") continue;
        const serialNumber = Number(record.sno);
        if (!Number.isInteger(serialNumber) || serialNumber < 1) {
            return `Invalid ${label} serial number`;
        }
        if (serialNumbers.has(serialNumber)) {
            return `${label} serial numbers must be unique`;
        }
        serialNumbers.add(serialNumber);
    }
    return null;
}

function collectPublicIds(shop) {
    const ids = [];

    if (shop?.image?.publicId) ids.push(shop.image.publicId);
    if (shop?.logo?.publicId) ids.push(shop.logo.publicId);
    if (shop?.banner?.publicId) ids.push(shop.banner.publicId);

    for (const product of shop?.products || []) {
        if (product?.image?.publicId) ids.push(product.image.publicId);
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
            email,
            phone,
            whatsapp,
            instagram,
            facebook,
            youtube,
            website,
            openingTime,
            closingTime,
            rating,
            reviewCount,
            googleReview,
            startingPrice,
            attractions,
            products,
        } = body;

        if (!isPositiveInteger(sno)) {
            return NextResponse.json({ status: "error", message: "S.No. must be a positive integer", data: null, error: "S.No. must be a positive integer" }, { status: 400 });
        }

        if (typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ status: "error", message: "Title is required", data: null, error: "Title is required" }, { status: 400 });
        }

        if (typeof receivedSlug !== "string" || !receivedSlug.trim()) {
            return NextResponse.json({ status: "error", message: "Slug is required", data: null, error: "Slug is required" }, { status: 400 });
        }

        if (typeof shortLocation !== "string" || !shortLocation.trim()) {
            return NextResponse.json({ status: "error", message: "Short location is required", data: null, error: "Short location is required" }, { status: 400 });
        }

        for (const [label, records] of [["Product", products], ["Attraction", attractions]]) {
            if (!hasOwn(body, label === "Product" ? "products" : "attractions")) continue;
            const validationError = validateNestedSerialNumbers(label, records);
            if (validationError) {
                return NextResponse.json(
                    { status: "error", message: validationError, data: null, error: validationError },
                    { status: 400 },
                );
            }
        }

        const generatedSlug = createSlug(receivedSlug);
        if (!generatedSlug) {
            return NextResponse.json({ status: "error", message: "Valid slug is required", data: null, error: "Valid slug is required" }, { status: 400 });
        }

        const normalizedTitle = title.trim();
        const normalizedShortLocation = shortLocation.trim();

        const lastShop = await ReligiousShopModel.findOne({}).sort({ sno: -1 }).select("sno").session(session);
        const maxSno = lastShop?.sno || 0;

        if (_id) {
            const existingShop = await ReligiousShopModel.findById(_id).session(session);
            if (!existingShop) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "Religious shop not found", data: null, error: "Religious shop not found" }, { status: 404 });
            }

            const duplicateSlug = await ReligiousShopModel.findOne({ slug: generatedSlug, _id: { $ne: _id } }).session(session);
            if (duplicateSlug) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "A religious shop with this slug already exists", data: null, error: "A religious shop with this slug already exists" }, { status: 409 });
            }

            let updatedSno = existingShop.sno;
            if (hasOwn(body, "sno")) {
                updatedSno = Number(sno);
                if (!isPositiveInteger(sno)) {
                    await session.abortTransaction();
                    return NextResponse.json({ status: "error", message: "Invalid serial number", data: null, error: "Invalid serial number" }, { status: 400 });
                }

                if (updatedSno !== existingShop.sno) {
                    if (updatedSno < existingShop.sno) {
                        await ReligiousShopModel.updateMany({ sno: { $gte: updatedSno, $lt: existingShop.sno, _id: { $ne: _id } } }, { $inc: { sno: 1 } }).session(session);
                    } else {
                        await ReligiousShopModel.updateMany({ sno: { $gt: existingShop.sno, $lte: updatedSno, _id: { $ne: _id } } }, { $inc: { sno: -1 } }).session(session);
                    }
                }
            }

            let updatedImage = existingShop.image;
            if (image?.data) {
                const uploadedImage = await uploadSingleImage(image, "braj_deals/religious-shops");
                if (uploadedImage) updatedImage = uploadedImage;
            }

            let updatedLogo = existingShop.logo;
            if (logo?.data) {
                const uploadedLogo = await uploadSingleImage(logo, "braj_deals/religious-shops/logos");
                if (uploadedLogo) updatedLogo = uploadedLogo;
            }

            let updatedBanner = existingShop.banner;
            if (banner?.data) {
                const uploadedBanner = await uploadSingleImage(banner, "braj_deals/religious-shops/banners");
                if (uploadedBanner) updatedBanner = uploadedBanner;
            }

            const normalizedProducts = hasOwn(body, "products")
                ? await normalizeProducts(products)
                : existingShop.products;
            const normalizedAttractions = hasOwn(body, "attractions")
                ? normalizeAttractions(attractions)
                : existingShop.attractions;

            const previousPublicIds = new Set(collectPublicIds(existingShop));
            const submittedPublicIds = new Set();

            if (updatedImage?.publicId) submittedPublicIds.add(updatedImage.publicId);
            if (updatedLogo?.publicId) submittedPublicIds.add(updatedLogo.publicId);
            if (updatedBanner?.publicId) submittedPublicIds.add(updatedBanner.publicId);
            for (const item of normalizedProducts) {
                if (item.image?.publicId) submittedPublicIds.add(item.image.publicId);
            }

            for (const publicId of previousPublicIds) {
                if (!submittedPublicIds.has(publicId)) {
                    try {
                        await deleteImage(publicId);
                    } catch (error) {
                        console.error("Failed to delete stale religious shop image:", error);
                    }
                }
            }

            existingShop.sno = updatedSno;
            existingShop.slug = generatedSlug;
            existingShop.title = normalizedTitle;
            if (hasOwn(body, "description")) existingShop.description = typeof description === "string" ? description.trim() : "";
            existingShop.image = updatedImage;
            existingShop.logo = updatedLogo;
            existingShop.banner = updatedBanner;
            if (hasOwn(body, "location")) existingShop.location = typeof location === "string" ? location.trim() : "";
            existingShop.shortLocation = normalizedShortLocation;
            for (const [field, value] of Object.entries({
                mapLink, email, phone, whatsapp, instagram, facebook, youtube, website,
                openingTime, closingTime, googleReview,
            })) {
                if (hasOwn(body, field)) existingShop[field] = typeof value === "string" ? value.trim() : "";
            }
            if (hasOwn(body, "rating")) existingShop.rating = Number(rating) || 0;
            if (hasOwn(body, "reviewCount")) existingShop.reviewCount = Number(reviewCount) || 0;
            if (hasOwn(body, "startingPrice")) existingShop.startingPrice = Number(startingPrice) || 0;
            existingShop.attractions = normalizedAttractions;
            existingShop.products = normalizedProducts;

            await existingShop.save({ session });
            await session.commitTransaction();

            revalidatePath("/categories/religious-shops");
            revalidatePath(`/categories/religious-shops/${generatedSlug}`);

            return NextResponse.json({ status: "success", message: "Religious shop updated successfully", data: { data: [existingShop] }, error: null }, { status: 200 });
        }

        const duplicateSlug = await ReligiousShopModel.findOne({ slug: generatedSlug }).session(session);
        if (duplicateSlug) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "A religious shop with this slug already exists", data: null, error: "A religious shop with this slug already exists" }, { status: 409 });
        }

        const newSno = Number(sno);
        if (newSno <= maxSno) {
            await ReligiousShopModel.updateMany({ sno: { $gte: newSno } }, { $inc: { sno: 1 } }).session(session);
        }

        const uploadedImage = await uploadSingleImage(image, "braj_deals/religious-shops");
        const uploadedLogo = await uploadSingleImage(logo, "braj_deals/religious-shops/logos");
        const uploadedBanner = await uploadSingleImage(banner, "braj_deals/religious-shops/banners");
        const normalizedProducts = await normalizeProducts(products);
        const normalizedAttractions = normalizeAttractions(attractions);

        const newReligiousShop = new ReligiousShopModel({
            sno: newSno,
            slug: generatedSlug,
            title: normalizedTitle,
            description: typeof description === "string" ? description.trim() : "",
            image: uploadedImage,
            logo: uploadedLogo,
            banner: uploadedBanner,
            location: typeof location === "string" ? location.trim() : "",
            shortLocation: normalizedShortLocation,
            mapLink: mapLink?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
            whatsapp: whatsapp?.trim() || "",
            instagram: instagram?.trim() || "",
            facebook: facebook?.trim() || "",
            youtube: youtube?.trim() || "",
            website: website?.trim() || "",
            openingTime: openingTime?.trim() || "",
            closingTime: closingTime?.trim() || "",
            rating: Number(rating) || 0,
            reviewCount: Number(reviewCount) || 0,
            googleReview: googleReview?.trim() || "",
            startingPrice: Number(startingPrice) || 0,
            attractions: normalizedAttractions,
            products: normalizedProducts,
        });

        await newReligiousShop.save({ session });
        await session.commitTransaction();

        revalidatePath("/categories/religious-shops");
        revalidatePath(`/categories/religious-shops/${generatedSlug}`);

        return NextResponse.json({ status: "success", message: "Religious shop added successfully", data: { data: [newReligiousShop] }, error: null }, { status: 201 });
    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: error?.statusCode || 500 });
    } finally {
        if (session && typeof session.endSession === "function") session.endSession();
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
            const shop = await ReligiousShopModel.findById(_id).lean();
            if (!shop) {
                return NextResponse.json({ status: "error", message: "Religious shop not found", data: null, error: "Religious shop not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", message: "Religious shop fetched successfully", data: { data: [shop] }, error: null }, { status: 200 });
        }

        if (slug) {
            const shop = await ReligiousShopModel.findOne({ slug }).lean();
            if (!shop) {
                return NextResponse.json({ status: "error", message: "Religious shop not found", data: null, error: "Religious shop not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", message: "Religious shop fetched successfully", data: { data: [shop] }, error: null }, { status: 200 });
        }

        const cleanSearchValue = searchValue.trim();
        const cleanShortLocation = shortLocation.trim();

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

        const totalData = await ReligiousShopModel.countDocuments();
        const totalFilteredData = await ReligiousShopModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalFilteredData / limit) || 1;
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const skip = (currentPage - 1) * limit;

        const shops = await ReligiousShopModel.find(searchQuery)
            .sort({ [sortKey]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            status: "success",
            message: "Religious shops fetched successfully",
            data: {
                data: shops,
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
        console.error("Religious shop GET API Error:", error);
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
            return NextResponse.json({ status: "error", message: "Religious shop ID is required", data: null, error: "Religious shop ID is required" }, { status: 400 });
        }

        const shop = await ReligiousShopModel.findById(_id).session(session);
        if (!shop) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Religious shop not found", data: null, error: "Religious shop not found" }, { status: 404 });
        }

        const publicIds = collectPublicIds(shop);
        await ReligiousShopModel.findByIdAndDelete(_id, { session });
        await ReligiousShopModel.updateMany({ sno: { $gt: shop.sno } }, { $inc: { sno: -1 } }).session(session);
        await session.commitTransaction();

        if (publicIds.length) {
            await bulkDeleteImages(publicIds);
        }

        revalidatePath("/categories/religious-shops");
        return NextResponse.json({ status: "success", message: "Religious shop deleted successfully", data: null, error: null }, { status: 200 });
    } catch (error) {
        const errorMessage = await getErrorMessage(error, session);
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
    } finally {
        if (session && typeof session.endSession === "function") session.endSession();
    }
}
