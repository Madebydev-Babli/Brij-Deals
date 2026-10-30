import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { PlaceModel } from "../../../../backend/models/place";
import { uploadImage, deleteImage } from "@/utility/server-utility";
import { revalidatePath } from "next/cache";

function getErrorMessage(error) {
  if (error?.code === 11000) {
    if (error?.keyPattern?.slug) {
      return "A place with this slug already exists";
    }

    return "Duplicate value already exists";
  }

  if (error?.name === "ValidationError") {
    const firstError = Object.values(error.errors || {})[0];
    return firstError?.message || "Validation failed";
  }

  return error?.message || "Something went wrong";
}

function createSlug(title) {
  return title
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function clearSearch(value) {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeUploadedImage(uploadedImage) {
  if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
    return null;
  }

  return {
    url: uploadedImage.secure_url,
    publicId: uploadedImage.public_id,
  };
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isPositiveInteger(value) {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && !value.trim())
  ) {
    return false;
  }

  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

async function uploadGalleryImages(gallery = []) {
  if (!Array.isArray(gallery)) return [];

  const uploadedGallery = [];

  for (const item of gallery) {
    if (!item?.image) continue;

    if (item.image.data) {
      const uploadedImage = normalizeUploadedImage(
        await uploadImage(item.image.data, "braj_deals/places/gallery"),
      );

      if (uploadedImage) {
        uploadedGallery.push({
          ...(item.sno !== undefined && item.sno !== null && item.sno !== ""
            ? { sno: Number(item.sno) }
            : {}),
          image: uploadedImage,
          title: item.title?.trim() || "",
        });
      }
    } else if (item.image.url && item.image.publicId) {
      uploadedGallery.push({
        ...(item.sno !== undefined && item.sno !== null && item.sno !== ""
          ? { sno: Number(item.sno) }
          : {}),
        image: {
          url: item.image.url,
          publicId: item.image.publicId,
        },
        title: item.title?.trim() || "",
      });
    }
  }

  return uploadedGallery;
}

export async function POST(req) {
  const session = await mongoose.startSession();

  try {
    await connectToDatabase();

    let user;
    try {
      user = await verifyToken(req);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      _id,
      sno,
      title,
      slug: receivedSlug,
      description,
      history,
      image,
      banner,
      location,
      openingTime,
      closingTime,
      artiTimings,
      gallery,
      mapEmbed,
      mapLink,
      attractions,
      visitorTips,
    } = body;

    if (!isPositiveInteger(sno)) {
      return NextResponse.json(
        { status: "error", message: "S.No. must be a positive integer" },
        { status: 400 },
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { status: "error", message: "Title is required" },
        { status: 400 },
      );
    }

    if (typeof location !== "string" || !location.trim()) {
      return NextResponse.json(
        { status: "error", message: "Full Location / Address is required" },
        { status: 400 },
      );
    }

    for (const [label, records] of [
      ["Aarti Timing", artiTimings],
      ["Attraction", attractions],
      ["Visitor Tip", visitorTips],
    ]) {
      if (!Array.isArray(records)) continue;
      const serialNumbers = new Set();
      for (const record of records) {
        if (record?.sno === undefined || record.sno === null || record.sno === "") continue;
        const serialNumber = Number(record.sno);
        if (!Number.isInteger(serialNumber) || serialNumber < 1) {
          return NextResponse.json(
            { status: "error", message: `Invalid ${label} serial number` },
            { status: 400 },
          );
        }
        if (serialNumbers.has(serialNumber)) {
          return NextResponse.json(
            { status: "error", message: `${label} serial numbers must be unique` },
            { status: 400 },
          );
        }
        serialNumbers.add(serialNumber);
      }
    }

    for (const item of Array.isArray(gallery) ? gallery : []) {
      if (!item?.image) continue;

      const hasSerialNumber =
        item.sno !== undefined && item.sno !== null && item.sno !== "";
      if (item.image.data && !hasSerialNumber) {
        return NextResponse.json(
          { status: "error", message: "Gallery serial number is required" },
          { status: 400 },
        );
      }

      if (hasSerialNumber) {
        const serialNumber = Number(item.sno);
        if (!Number.isInteger(serialNumber) || serialNumber < 1) {
          return NextResponse.json(
            { status: "error", message: "Invalid gallery serial number" },
            { status: 400 },
          );
        }
      }
    }

    const generatedSlug = createSlug(title) || createSlug(receivedSlug);

    if (!generatedSlug) {
      return NextResponse.json(
        { status: "error", message: "Valid title or slug is required" },
        { status: 400 },
      );
    }

    session.startTransaction();

    const lastPlace = await PlaceModel.findOne({})
      .sort({ sno: -1 })
      .select("sno")
      .session(session);

    const maxSno = lastPlace?.sno || 0;

    if (_id) {
      const existingPlace = await PlaceModel.findById(_id).session(session);

      if (!existingPlace) {
        await session.abortTransaction();
        return NextResponse.json(
          { status: "error", message: "Place not found" },
          { status: 404 },
        );
      }

      const oldImage = existingPlace.image;
      const oldBanner = existingPlace.banner;

      const duplicateSlug = await PlaceModel.findOne({
        slug: generatedSlug,
        _id: { $ne: _id },
      }).session(session);

      if (duplicateSlug) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            status: "error",
            message: "A place with this slug already exists",
          },
          { status: 400 },
        );
      }

      let updatedSno = existingPlace.sno;
      updatedSno = Number(sno);

      if (updatedSno !== existingPlace.sno) {
        if (updatedSno < existingPlace.sno) {
          await PlaceModel.updateMany(
            {
              sno: { $gte: updatedSno, $lt: existingPlace.sno },
              _id: { $ne: _id },
            },
            { $inc: { sno: 1 } },
          ).session(session);
        } else {
          await PlaceModel.updateMany(
            {
              sno: { $gt: existingPlace.sno, $lte: updatedSno },
              _id: { $ne: _id },
            },
            { $inc: { sno: -1 } },
          ).session(session);
        }
      }

      let updatedImage = existingPlace.image;
      if (image?.data) {
        updatedImage =
          normalizeUploadedImage(
            await uploadImage(image.data, "braj_deals/places"),
          ) || existingPlace.image;
      }

      let updatedBanner = existingPlace.banner;
      if (banner?.data) {
        updatedBanner =
          normalizeUploadedImage(
            await uploadImage(banner.data, "braj_deals/places/banners"),
          ) || existingPlace.banner;
      }

      const normalizedGallery = [];
      const submittedGalleryPublicIds = new Set();

      const galleryToSave = hasOwn(body, "gallery")
        ? Array.isArray(gallery) ? gallery : []
        : existingPlace.gallery || [];

      for (const item of galleryToSave) {
        if (!item?.image) continue;

        if (item.image.data) {
          const uploadedImage = await uploadImage(
            item.image.data,
            "braj_deals/places/gallery",
          );

          if (uploadedImage) {
            const uploadedGalleryItem = {
              ...(item.sno !== undefined && item.sno !== null && item.sno !== ""
                ? { sno: Number(item.sno) }
                : {}),
              image: normalizeUploadedImage(uploadedImage),
              title: item.title?.trim() || "",
            };

            submittedGalleryPublicIds.add(uploadedGalleryItem.image.publicId);
            normalizedGallery.push(uploadedGalleryItem);
          }
        } else if (item.image.url && item.image.publicId) {
          const existingGalleryItem = {
            ...(item.sno !== undefined && item.sno !== null && item.sno !== ""
              ? { sno: Number(item.sno) }
              : {}),
            image: {
              url: item.image.url,
              publicId: item.image.publicId,
            },
            title: item.title?.trim() || "",
          };

          submittedGalleryPublicIds.add(item.image.publicId);
          normalizedGallery.push(existingGalleryItem);
        }
      }

      const previousGalleryPublicIds = new Set(
        (existingPlace.gallery || [])
          .map((galleryItem) => galleryItem?.image?.publicId)
          .filter(Boolean),
      );

      if (hasOwn(body, "gallery")) {
        for (const publicId of previousGalleryPublicIds) {
          if (!submittedGalleryPublicIds.has(publicId)) {
            try {
              await deleteImage(publicId);
            } catch (galleryError) {
              console.error(
                "Failed to delete removed gallery image:",
                galleryError,
              );
            }
          }
        }
      }

      existingPlace.sno = updatedSno;
      existingPlace.slug = generatedSlug;
      existingPlace.title = title.trim();
      if (hasOwn(body, "description")) {
        existingPlace.description = typeof description === "string" ? description.trim() : "";
      }
      if (hasOwn(body, "history")) {
        existingPlace.history = typeof history === "string" ? history.trim() : "";
      }
      existingPlace.image = updatedImage;
      existingPlace.banner = updatedBanner;
      existingPlace.location = location.trim();
      if (hasOwn(body, "openingTime")) {
        existingPlace.openingTime = typeof openingTime === "string" ? openingTime.trim() : "";
      }
      if (hasOwn(body, "closingTime")) {
        existingPlace.closingTime = typeof closingTime === "string" ? closingTime.trim() : "";
      }
      if (hasOwn(body, "artiTimings")) {
        existingPlace.artiTimings = Array.isArray(artiTimings) ? artiTimings : [];
      }
      if (hasOwn(body, "gallery")) existingPlace.gallery = normalizedGallery;
      if (hasOwn(body, "mapEmbed")) {
        existingPlace.mapEmbed = typeof mapEmbed === "string" ? mapEmbed.trim() : "";
      }
      if (hasOwn(body, "mapLink")) {
        existingPlace.mapLink = typeof mapLink === "string" ? mapLink.trim() : "";
      }
      if (hasOwn(body, "attractions")) {
        existingPlace.attractions = Array.isArray(attractions) ? attractions : [];
      }
      if (hasOwn(body, "visitorTips")) {
        existingPlace.visitorTips = Array.isArray(visitorTips) ? visitorTips : [];
      }

      await existingPlace.save({ session });
      await session.commitTransaction();

      if (
        image?.data &&
        oldImage?.publicId &&
        oldImage.publicId !== updatedImage?.publicId
      ) {
        try {
          await deleteImage(oldImage.publicId);
        } catch (error) {
          console.error("Failed to delete old place image:", error);
        }
      }

      if (
        banner?.data &&
        oldBanner?.publicId &&
        oldBanner.publicId !== updatedBanner?.publicId
      ) {
        try {
          await deleteImage(oldBanner.publicId);
        } catch (error) {
          console.error("Failed to delete old place banner:", error);
        }
      }

      revalidatePath("/");
      revalidatePath("/categories/places-to-visit");
      revalidatePath(`/categories/places-to-visit/${generatedSlug}`);

      return NextResponse.json({
        status: "success",
        message: "Place updated successfully",
        data: { data: existingPlace },
      });
    }

    const duplicateSlug = await PlaceModel.findOne({
      slug: generatedSlug,
    }).session(session);

    if (duplicateSlug) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          status: "error",
          message: "A place with this slug already exists",
        },
        { status: 400 },
      );
    }

    const newSno = Number(sno);
    if (newSno <= maxSno) {
      await PlaceModel.updateMany(
        { sno: { $gte: newSno } },
        { $inc: { sno: 1 } },
      ).session(session);
    }

    const uploadedImage = image?.data
      ? normalizeUploadedImage(await uploadImage(image.data, "braj_deals/places"))
      : null;
    const uploadedBanner = banner?.data
      ? normalizeUploadedImage(
        await uploadImage(
          banner.data,
          "braj_deals/places/banners",
          5 * 1024 * 1024,
        ),
      )
      : null;
    const uploadedGallery = await uploadGalleryImages(
      Array.isArray(gallery) ? gallery : [],
    );

    const newPlace = new PlaceModel({
      sno: newSno,
      slug: generatedSlug,
      title: title.trim(),
      ...(typeof description === "string" ? { description: description.trim() } : {}),
      ...(typeof history === "string" ? { history: history.trim() } : {}),
      image: uploadedImage,
      banner: uploadedBanner,
      location: location.trim(),
      ...(typeof openingTime === "string" ? { openingTime: openingTime.trim() } : {}),
      ...(typeof closingTime === "string" ? { closingTime: closingTime.trim() } : {}),
      artiTimings: Array.isArray(artiTimings) ? artiTimings : [],
      gallery: uploadedGallery,
      mapEmbed: typeof mapEmbed === "string" ? mapEmbed.trim() : "",
      mapLink: typeof mapLink === "string" ? mapLink.trim() : "",
      attractions: Array.isArray(attractions) ? attractions : [],
      visitorTips: Array.isArray(visitorTips) ? visitorTips : [],
    });

    await newPlace.save({ session });
    await session.commitTransaction();

    revalidatePath("/");
    revalidatePath("/categories/places-to-visit");
    revalidatePath(`/categories/places-to-visit/${generatedSlug}`);

    return NextResponse.json({
      status: "success",
      message: "Place added successfully",
      data: { data: newPlace },
    });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch {}

    console.error("Place POST API Error:", error);

    return NextResponse.json(
      { status: "error", message: getErrorMessage(error) },
      { status: error?.statusCode || 500 },
    );
  } finally {
    session.endSession();
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
    const location = searchParams.get("location") || "";
    const clearSearchValue = clearSearch(searchValue);
    const clearLocation = clearSearch(location);

    if (_id) {
      const place = await PlaceModel.findById(_id).lean();
      if (!place) {
        return NextResponse.json(
          { status: "error", message: "Place not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Place fetched successfully",
        data: { data: [place] },
      });
    }

    if (slug) {
      const place = await PlaceModel.findOne({ slug }).lean();
      if (!place) {
        return NextResponse.json(
          { status: "error", message: "Place not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Place fetched successfully",
        data: { data: [place] },
      });
    }

    const searchQuery = {
      ...(clearSearchValue
        ? {
          title: {
            $regex: clearSearchValue,
            $options: "i",
          },
        }
        : {}),
      ...(clearLocation
        ? {
          location: {
            $regex: clearLocation,
            $options: "i",
          },
        }
        : {}),
    };

    const totalData = await PlaceModel.countDocuments();
    const totalFilteredData = await PlaceModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalFilteredData / limit) || 1;
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const skip = (currentPage - 1) * limit;

    const places = await PlaceModel.find(searchQuery)
      .sort({ [sortKey]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      status: "success",
      message: "Places fetched successfully",
      data: {
        data: places,
        extra: {
          page: currentPage,
          limit,
          totalData,
          totalFilteredData,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Place GET API Error:", error);

    return NextResponse.json(
      { status: "error", message: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  const session = await mongoose.startSession();

  try {
    await connectToDatabase();

    let user;
    try {
      user = await verifyToken(req);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { status: "error", message: "Place ID is required" },
        { status: 400 },
      );
    }

    session.startTransaction();

    const place = await PlaceModel.findById(_id).session(session);
    if (!place) {
      await session.abortTransaction();
      return NextResponse.json(
        { status: "error", message: "Place not found" },
        { status: 404 },
      );
    }

    const deletedSno = place.sno;
    const deletedImage = place.image;
    const deletedBanner = place.banner;

    await PlaceModel.findByIdAndDelete(_id).session(session);
    await PlaceModel.updateMany(
      { sno: { $gt: deletedSno } },
      { $inc: { sno: -1 } },
    ).session(session);

    await session.commitTransaction();

    if (deletedImage?.publicId) {
      try {
        await deleteImage(deletedImage.publicId);
      } catch (imageError) {
        console.error("Failed to delete place image:", imageError);
      }
    }

    if (deletedBanner?.publicId) {
      try {
        await deleteImage(deletedBanner.publicId);
      } catch (imageError) {
        console.error("Failed to delete place banner:", imageError);
      }
    }

    if (Array.isArray(place.gallery)) {
      for (const galleryItem of place.gallery) {
        if (galleryItem?.image?.publicId) {
          try {
            await deleteImage(galleryItem.image.publicId);
          } catch (imageError) {
            console.error("Failed to delete gallery image:", imageError);
          }
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/categories/places");
    revalidatePath(`/categories/places/${place.slug}`);

    return NextResponse.json({
      status: "success",
      message: "Place deleted successfully",
    });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch {}

    console.error("Place DELETE API Error:", error);

    return NextResponse.json(
      { status: "error", message: getErrorMessage(error) },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
