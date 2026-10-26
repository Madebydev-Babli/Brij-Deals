import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import {
  clearSearch,
  deleteImage,
  bulkDeleteImages,
  getErrorMessage,
  isValidEmail,
  isValidPhoneNumber,
  uploadImage,
} from "@/utility/server-utility";
import {
  LOCATION_ENUM,
  RESTAURANT_CATEGORIES_ENUM,
} from "@/utility/utility-data";
import { RestaurentModel } from "../../../../backend/models/restaurent";
import { OfferModel } from "../../../../backend/models/offer";
import { MenuModel } from "../../../../backend/models/menu";
import { MenuItemModel } from "../../../../backend/models/menuItem";
import { AmenityModel } from "../../../../backend/models/amenity";
import { AttractionModel } from "../../../../backend/models/attraction";
import { GalleryModel } from "../../../../backend/models/gallery";

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPositiveInteger(value) {
  return (
    (typeof value === "number" ||
      (typeof value === "string" && value.trim() !== "")) &&
    Number.isInteger(Number(value)) &&
    Number(value) > 0
  );
}

function normalizeFoodType(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
}

async function uploadRestaurantImage(image, folder, maxSize) {
  const imageData =
    typeof image === "string" && image.startsWith("data:image/")
      ? image
      : image?.data;
  if (!imageData) return null;

  const uploaded = await uploadImage(imageData, folder, maxSize);
  if (!uploaded?.secure_url || !uploaded?.public_id) {
    throw new Error(`Restaurant image upload failed: ${folder}`);
  }

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  };
}

export async function POST(req) {
  let session = null;
  const uploadedPublicIds = [];
  let transactionCommitted = false;

  try {
    await connectToDatabase();

    session = await mongoose.startSession();
    session.startTransaction();

    const decoded = await verifyToken(req);

    if (!decoded) {
      await session.abortTransaction();

      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized access",
          data: null,
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      _id,
      sno,
      title,
      category,
      description,
      logo,
      banner,
      mapLink,
      location,
      shortLocation,
      email,
      phone,
      isVeg,
    } = body;

    if (!isPositiveInteger(sno)) {
      throw Object.assign(new Error("S.No. must be a positive integer"), {
        statusCode: 400,
      });
    }

    if (typeof title !== "string" || !title.trim()) {
      throw Object.assign(new Error("Title is required"), { statusCode: 400 });
    }

    if (typeof category !== "string" || !category.trim()) {
      throw Object.assign(new Error("Category is required"), {
        statusCode: 400,
      });
    }

    const normalizedCategory = category.trim();
    if (!RESTAURANT_CATEGORIES_ENUM.includes(normalizedCategory)) {
      throw Object.assign(new Error("Invalid category"), { statusCode: 400 });
    }

    if (typeof shortLocation !== "string" || !shortLocation.trim()) {
      throw Object.assign(new Error("Short location is required"), {
        statusCode: 400,
      });
    }

    const normalizedShortLocation = shortLocation.trim();
    if (!LOCATION_ENUM.includes(normalizedShortLocation)) {
      throw Object.assign(new Error("Invalid short location"), {
        statusCode: 400,
      });
    }

    const normalizedIsVeg = normalizeFoodType(isVeg);
    if (normalizedIsVeg === null) {
      throw Object.assign(new Error("Food type is required"), {
        statusCode: 400,
      });
    }

    const normalizedTitle = title.trim();
    const slug = createSlug(normalizedTitle);
    if (!slug) {
      throw Object.assign(
        new Error("A valid slug could not be generated from the title"),
        { statusCode: 400 },
      );
    }

    if (email !== undefined && email !== null && email !== "") {
      if (typeof email !== "string") {
        throw Object.assign(new Error("Email must be a string"), {
          statusCode: 400,
        });
      }

      const checkEmail = isValidEmail(email);
      if (!checkEmail.status) {
        throw Object.assign(new Error(checkEmail.message), { statusCode: 400 });
      }
    }

    if (phone !== undefined && phone !== null && phone !== "") {
      if (typeof phone !== "string") {
        throw Object.assign(new Error("Phone must be a string"), {
          statusCode: 400,
        });
      }

      const checkPhone = isValidPhoneNumber(phone);
      if (!checkPhone.status) {
        throw Object.assign(new Error(checkPhone.message), { statusCode: 400 });
      }
    }

    if (_id) {
      const restaurent = await RestaurentModel.findById(_id).session(session);

      if (!restaurent) {
        throw Object.assign(new Error("Restaurent not found"), {
          statusCode: 404,
        });
      }

      const updatedSno = Number(sno);
      if (updatedSno < restaurent.sno) {
        await RestaurentModel.updateMany(
          { sno: { $gte: updatedSno, $lt: restaurent.sno, _id: { $ne: _id } } },
          { $inc: { sno: 1 } },
          { session },
        );
      }

      if (updatedSno > restaurent.sno) {
        await RestaurentModel.updateMany(
          { sno: { $gt: restaurent.sno, $lte: updatedSno, _id: { $ne: _id } } },
          { $inc: { sno: -1 } },
          { session },
        );
      }

      const uploadedLogo = await uploadRestaurantImage(
        logo,
        "braj_deals/restaurent/logos",
        5 * 1024 * 1024,
      );
      if (uploadedLogo?.publicId) uploadedPublicIds.push(uploadedLogo.publicId);
      const uploadedBanner = await uploadRestaurantImage(
        banner,
        "braj_deals/restaurent/banners",
        5 * 1024 * 1024,
      );
      if (uploadedBanner?.publicId) uploadedPublicIds.push(uploadedBanner.publicId);

      const update = {
        sno: updatedSno,
        title: normalizedTitle,
        slug,
        category: normalizedCategory,
        shortLocation: normalizedShortLocation,
        isVeg: normalizedIsVeg,
        ...(uploadedLogo ? { logo: uploadedLogo } : {}),
        ...(uploadedBanner ? { banner: uploadedBanner } : {}),
      };
      for (const field of ["description", "mapLink", "location", "email", "phone"]) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          update[field] = typeof body[field] === "string" ? body[field].trim() : "";
        }
      }

      const updatedRestaurent = await RestaurentModel.findByIdAndUpdate(
        _id,
        update,
        { new: true, session, runValidators: true },
      );

      await session.commitTransaction();
      transactionCommitted = true;

      if (uploadedLogo && restaurent.logo?.publicId) {
        await deleteImage(restaurent.logo.publicId);
      }

      if (uploadedBanner && restaurent.banner?.publicId) {
        await deleteImage(restaurent.banner.publicId);
      }

      revalidatePath("/categories/restaurants");
      revalidatePath(`/categories/restaurants/${updatedRestaurent?.slug}`);

      return NextResponse.json(
        {
          status: "success",
          message: "Restaurent updated successfully",
          data: null,
          error: null,
        },
        { status: 200 },
      );
    }

    // CREATE RESTAURANT
    const numericSno = Number(sno);
    const snoPresent = await RestaurentModel.findOne({ sno: numericSno }).session(
      session,
    );

    if (snoPresent) {
      await RestaurentModel.updateMany(
        { sno: { $gte: numericSno } },
        { $inc: { sno: 1 } },
        { session },
      );
    }

    const uploadedLogo = await uploadRestaurantImage(
      logo,
      "braj_deals/restaurent/logos",
      5 * 1024 * 1024,
    );
    if (uploadedLogo?.publicId) uploadedPublicIds.push(uploadedLogo.publicId);
    const uploadedBanner = await uploadRestaurantImage(
      banner,
      "braj_deals/restaurent/banners",
      5 * 1024 * 1024,
    );
    if (uploadedBanner?.publicId) uploadedPublicIds.push(uploadedBanner.publicId);

    const newRestaurent = new RestaurentModel({
      sno: numericSno,
      title: normalizedTitle,
      slug,
      category: normalizedCategory,
      shortLocation: normalizedShortLocation,
      isVeg: normalizedIsVeg,
      description: typeof description === "string" ? description.trim() : "",
      logo: uploadedLogo,
      banner: uploadedBanner,
      mapLink: typeof mapLink === "string" ? mapLink.trim() : "",
      location: typeof location === "string" ? location.trim() : "",
      email: typeof email === "string" ? email.trim() : "",
      phone: typeof phone === "string" ? phone.trim() : "",
    });

    await newRestaurent.save({ session });

    await session.commitTransaction();
    transactionCommitted = true;

    revalidatePath("/categories/restaurants");
    revalidatePath(`/categories/restaurants/${newRestaurent?.slug}`);

    return NextResponse.json(
      {
        status: "success",
        message: "Restaurent added successfully",
        data: null,
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    if (session?.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (transactionError) {
        console.error("Transaction rollback failed:", transactionError);
      }
    }

    console.error("Restaurant creation failed:", error);
    if (!transactionCommitted) {
      for (const publicId of uploadedPublicIds) {
        try {
          await deleteImage(publicId);
        } catch (cleanupError) {
          console.error("Failed to clean up restaurant image:", cleanupError);
        }
      }
    }

    return NextResponse.json(
      {
        status: "error",
        data: null,
        message: error.message || "Something went wrong",
        error: error.message || "Something went wrong",
      },
      {
        status:
          error.statusCode ||
          (error instanceof mongoose.Error.ValidationError ? 400 : 500),
      },
    );
  } finally {
    if (session) await session.endSession();
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const {
      _id,
      sortOrder = -1,
      sortKey = "createdAt",
      limit = 10,
      page = 1,
      searchValue = "",
      category,
      shortLocation,
    } = Object.fromEntries(searchParams.entries());

    const search = {
      _id: mongoose.Types.ObjectId.isValid(_id) ? _id : undefined,
      category: category ? category : undefined,
      shortLocation: shortLocation ? shortLocation : undefined,

      $or: [
        {
          title: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
        {
          category: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
        {
          description: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
        {
          location: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
        {
          shortLocation: {
            $regex: new RegExp(searchValue || ""),
            $options: "i",
          },
        },
        {
          email: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
        {
          phone: { $regex: new RegExp(searchValue || ""), $options: "i" },
        },
      ],
    };

    clearSearch(search);

    const restaurents = await RestaurentModel.find(search)
      .skip((Number(page) - 1) * Number(limit))
      .limit(limit)
      .sort({ [sortKey]: Number(sortOrder) })
      .lean();

    const totalFilteredData =
      await RestaurentModel.find(search).countDocuments();
    const totalData = await RestaurentModel.find({}).countDocuments();

    const extra = {
      page: String(page),
      limit: String(limit),
      totalFilteredData: String(totalFilteredData),
      totalData: String(totalData),
      totalPages: String(Math.ceil(totalFilteredData / limit)),
    };

    return NextResponse.json(
      {
        status: "success",
        message: "Restaurents fetched successfully",
        data: { data: restaurents, extra },
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = await getErrorMessage(error);
    return NextResponse.json(
      {
        status: "error",
        data: null,
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 },
    );
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
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized access",
          data: null,
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json(
        {
          status: "error",
          message: "_id is required",
          data: null,
          error: "_id is required",
        },
        { status: 400 },
      );
    }

    const deleted = await RestaurentModel.findByIdAndDelete(_id, { session });

    if (!deleted) {
      return NextResponse.json(
        {
          status: "error",
          message: "Restaurent not found",
          data: null,
          error: "Restaurent not found",
        },
        { status: 404 },
      );
    }

    await RestaurentModel.updateMany(
      { sno: { $gt: deleted.sno } },
      { $inc: { sno: -1 } },
      { session },
    );

    await OfferModel.deleteMany({ restaurentId: _id }, { session });
    await MenuModel.deleteMany({ restaurentId: _id }, { session });
    await MenuItemModel.deleteMany({ restaurentId: _id }, { session });
    await AttractionModel.deleteMany({ restaurentId: _id }, { session });

    await AmenityModel.deleteMany({ restaurentId: _id }, { session });

    const galleries = await GalleryModel.find({ restaurentId: _id });
    const galleriesPublicIds = galleries
      .map((gallery) => gallery.image?.publicId)
      .filter(Boolean);

    await GalleryModel.deleteMany({ restaurentId: _id }, { session });

    await session.commitTransaction();
    session.endSession();

    await bulkDeleteImages([
      ...galleriesPublicIds,
      deleted.logo?.publicId,
      deleted.banner?.publicId,
    ].filter(Boolean));

    return NextResponse.json(
      {
        status: "success",
        message: "Restaurent deleted successfully",
        data: null,
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = await getErrorMessage(error, session);
    return NextResponse.json(
      {
        status: "error",
        data: null,
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
