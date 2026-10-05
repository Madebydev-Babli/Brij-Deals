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
          image: uploadedImage,
          title: item.title?.trim() || "",
        });
      }
    } else if (item.image.url && item.image.publicId) {
      uploadedGallery.push({
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
      artiTimings = [],
      gallery = [],
      mapEmbed,
      mapLink,
      attractions = [],
      visitorTips = [],
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Title is required" },
        { status: 400 },
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Description is required" },
        { status: 400 },
      );
    }

    if (!history?.trim()) {
      return NextResponse.json(
        { status: "error", message: "History is required" },
        { status: 400 },
      );
    }

    if (!_id && !image?.data) {
      return NextResponse.json(
        { status: "error", message: "Place image is required" },
        { status: 400 },
      );
    }

    if (!_id && !banner?.data) {
      return NextResponse.json(
        { status: "error", message: "Banner image is required" },
        { status: 400 },
      );
    }

    if (!location?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Location is required" },
        { status: 400 },
      );
    }

    if (!openingTime?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Opening time is required" },
        { status: 400 },
      );
    }

    if (!closingTime?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Closing time is required" },
        { status: 400 },
      );
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
      if (sno !== undefined && sno !== null && sno !== "") {
        updatedSno = Number(sno);

        if (!Number.isInteger(updatedSno) || updatedSno < 1) {
          await session.abortTransaction();
          return NextResponse.json(
            { status: "error", message: "Invalid serial number" },
            { status: 400 },
          );
        }

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

      for (const item of Array.isArray(gallery) ? gallery : []) {
        if (!item?.image) continue;

        if (item.image.data) {
          const uploadedImage = await uploadImage(
            item.image.data,
            "braj_deals/places/gallery",
          );

          if (uploadedImage) {
            const uploadedGalleryItem = {
              image: normalizeUploadedImage(uploadedImage),
              title: item.title?.trim() || "",
            };

            submittedGalleryPublicIds.add(uploadedGalleryItem.image.publicId);
            normalizedGallery.push(uploadedGalleryItem);
          }
        } else if (item.image.url && item.image.publicId) {
          const existingGalleryItem = {
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

      existingPlace.sno = updatedSno;
      existingPlace.slug = generatedSlug;
      existingPlace.title = title.trim();
      existingPlace.description = description.trim();
      existingPlace.history = history.trim();
      existingPlace.image = updatedImage;
      existingPlace.banner = updatedBanner;
      existingPlace.location = location.trim();
      existingPlace.openingTime = openingTime.trim();
      existingPlace.closingTime = closingTime.trim();
      existingPlace.artiTimings = Array.isArray(artiTimings) ? artiTimings : [];
      existingPlace.gallery = normalizedGallery;
      existingPlace.mapEmbed = mapEmbed?.trim() || "";
      existingPlace.mapLink = mapLink?.trim() || "";
      existingPlace.attractions = Array.isArray(attractions) ? attractions : [];
      existingPlace.visitorTips = Array.isArray(visitorTips) ? visitorTips : [];

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

    let newSno = maxSno + 1;
    if (sno !== undefined && sno !== null && sno !== "") {
      newSno = Number(sno);

      if (!Number.isInteger(newSno) || newSno < 1) {
        await session.abortTransaction();
        return NextResponse.json(
          { status: "error", message: "Invalid serial number" },
          { status: 400 },
        );
      }

      if (newSno <= maxSno) {
        await PlaceModel.updateMany(
          { sno: { $gte: newSno } },
          { $inc: { sno: 1 } },
        ).session(session);
      }
    }

    const imageUploadResponse = await uploadImage(
      image.data,
      "braj_deals/places",
    );
    const bannerUploadResponse = await uploadImage(
      banner.data,
      "braj_deals/places/banners",
      1024 * 1024 * 2,
    );
    const uploadedImage = normalizeUploadedImage(imageUploadResponse);
    const uploadedBanner = normalizeUploadedImage(bannerUploadResponse);

    if (!uploadedImage || !uploadedBanner) {
      const failedUploads = [
        { name: "Place image", uploaded: uploadedImage, response: imageUploadResponse },
        { name: "Place banner", uploaded: uploadedBanner, response: bannerUploadResponse },
      ]
        .filter((upload) => !upload.uploaded)
        .map(({ name, response }) => {
          const reason =
            response?.message ||
            "Cloudinary did not return a valid image URL and public ID";
          return `${name}: ${reason}`;
        });

      throw new Error(`Required image upload failed. ${failedUploads.join("; ")}`);
    }

    const uploadedGallery = await uploadGalleryImages(gallery);

    const newPlace = new PlaceModel({
      sno: newSno,
      slug: generatedSlug,
      title: title.trim(),
      description: description.trim(),
      history: history.trim(),
      image: uploadedImage,
      banner: uploadedBanner,
      location: location.trim(),
      openingTime: openingTime.trim(),
      closingTime: closingTime.trim(),
      artiTimings: Array.isArray(artiTimings) ? artiTimings : [],
      gallery: uploadedGallery,
      mapEmbed: mapEmbed?.trim() || "",
      mapLink: mapLink?.trim() || "",
      attractions: Array.isArray(attractions) ? attractions : [],
      visitorTips: Array.isArray(visitorTips) ? visitorTips : [],
    });

    await newPlace.save({ session });
    await session.commitTransaction();

    revalidatePath("/");
    revalidatePath("/categories/places");
    revalidatePath(`/categories/places/${generatedSlug}`);

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
      { status: 500 },
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
    const clearSearchValue = clearSearch(searchValue);

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

    const searchQuery = clearSearchValue
      ? {
          $or: [
            { title: { $regex: clearSearchValue, $options: "i" } },
            { description: { $regex: clearSearchValue, $options: "i" } },
            { history: { $regex: clearSearchValue, $options: "i" } },
            { location: { $regex: clearSearchValue, $options: "i" } },
            { slug: { $regex: clearSearchValue, $options: "i" } },
          ],
        }
      : {};

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
