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

async function uploadSingleImage(imageData, folder, maxSize = 1024 * 1024 * 2) {
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
        title: item?.title?.trim() || "",
        distance: item?.distance?.trim() || "",
        time: item?.time?.trim() || "",
        mode: item?.mode?.trim() || "",
    })).filter((item) => item.title || item.distance || item.time || item.mode);
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
            attractions = [],
            products = [],
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

        if (startingPrice === undefined || startingPrice === null || startingPrice === "") {
            return NextResponse.json({ status: "error", message: "Starting Price is required", data: null, error: "Starting Price is required" }, { status: 400 });
        }

        const generatedSlug = createSlug(title) || createSlug(receivedSlug);
        if (!generatedSlug) {
            return NextResponse.json({ status: "error", message: "Valid title or slug is required", data: null, error: "Valid title or slug is required" }, { status: 400 });
        }

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
            if (sno !== undefined && sno !== null && sno !== "") {
                updatedSno = Number(sno);
                if (!Number.isInteger(updatedSno) || updatedSno < 1) {
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

            const normalizedProducts = await normalizeProducts(products);
            const normalizedAttractions = normalizeAttractions(attractions);

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
            existingShop.title = title.trim();
            existingShop.description = description.trim();
            existingShop.image = updatedImage;
            existingShop.logo = updatedLogo;
            existingShop.banner = updatedBanner;
            existingShop.location = location.trim();
            existingShop.shortLocation = shortLocation.trim();
            existingShop.mapLink = mapLink?.trim() || "";
            existingShop.email = email?.trim() || "";
            existingShop.phone = phone?.trim() || "";
            existingShop.whatsapp = whatsapp?.trim() || "";
            existingShop.instagram = instagram?.trim() || "";
            existingShop.facebook = facebook?.trim() || "";
            existingShop.youtube = youtube?.trim() || "";
            existingShop.website = website?.trim() || "";
            existingShop.openingTime = openingTime?.trim() || "";
            existingShop.closingTime = closingTime?.trim() || "";
            existingShop.rating = Number(rating) || 0;
            existingShop.reviewCount = Number(reviewCount) || 0;
            existingShop.googleReview = googleReview?.trim() || "";
            existingShop.startingPrice = Number(startingPrice) || 0;
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

        let newSno = maxSno + 1;
        if (sno !== undefined && sno !== null && sno !== "") {
            newSno = Number(sno);
            if (!Number.isInteger(newSno) || newSno < 1) {
                await session.abortTransaction();
                return NextResponse.json({ status: "error", message: "Invalid serial number", data: null, error: "Invalid serial number" }, { status: 400 });
            }
            if (newSno <= maxSno) {
                await ReligiousShopModel.updateMany({ sno: { $gte: newSno } }, { $inc: { sno: 1 } }).session(session);
            }
        }

        if (!image?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Main image is required", data: null, error: "Main image is required" }, { status: 400 });
        }

        if (!logo?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Logo is required", data: null, error: "Logo is required" }, { status: 400 });
        }

        if (!banner?.data) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Banner is required", data: null, error: "Banner is required" }, { status: 400 });
        }

        const uploadedImage = await uploadSingleImage(image, "braj_deals/religious-shops");
        const uploadedLogo = await uploadSingleImage(logo, "braj_deals/religious-shops/logos");
        const uploadedBanner = await uploadSingleImage(banner, "braj_deals/religious-shops/banners");
        const normalizedProducts = await normalizeProducts(products);
        const normalizedAttractions = normalizeAttractions(attractions);

        if (!uploadedImage || !uploadedLogo || !uploadedBanner) {
            await session.abortTransaction();
            return NextResponse.json({ status: "error", message: "Image upload failed", data: null, error: "Image upload failed" }, { status: 500 });
        }

        const newReligiousShop = new ReligiousShopModel({
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
        return NextResponse.json({ status: "error", data: null, message: errorMessage, error: errorMessage }, { status: 500 });
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
