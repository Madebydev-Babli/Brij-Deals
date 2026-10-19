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

export async function POST(req) {
  let session = null;

  try {
    await connectToDatabase();

    session = await mongoose.startSession();
    session.startTransaction();

    const decoded = await verifyToken(req);

    if (!decoded) {
      await session.abortTransaction();
      session.endSession();

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
    } = await req.json();

    const logoImageData = typeof logo === "string" ? logo : logo?.data;
    const bannerImageData = typeof banner === "string" ? banner : banner?.data;

    const maxSno = await RestaurentModel.findOne({}).sort({ sno: -1 });

    if (!title) {
      throw Object.assign(new Error("Title is required"), { statusCode: 400 });
    }

    if (!category) {
      throw Object.assign(new Error("Category is required"), {
        statusCode: 400,
      });
    }

    if (!RESTAURANT_CATEGORIES_ENUM.includes(category)) {
      throw Object.assign(new Error("Invalid category"), { statusCode: 400 });
    }

    if (!description) {
      throw Object.assign(new Error("Description is required"), {
        statusCode: 400,
      });
    }

    if (!logo) {
      throw Object.assign(new Error("Logo is required"), { statusCode: 400 });
    }

    if (!banner) {
      throw Object.assign(new Error("Banner is required"), { statusCode: 400 });
    }

    if (!location) {
      throw Object.assign(new Error("Location is required"), {
        statusCode: 400,
      });
    }

    if (!shortLocation) {
      throw Object.assign(new Error("Short location is required"), {
        statusCode: 400,
      });
    }

    if (!LOCATION_ENUM.includes(shortLocation)) {
      throw Object.assign(new Error("Invalid short location"), {
        statusCode: 400,
      });
    }

    if (!email) {
      throw Object.assign(new Error("Email is required"), { statusCode: 400 });
    }

    const checkEmail = isValidEmail(email);

    if (!checkEmail.status) {
      throw Object.assign(new Error(checkEmail.message), { statusCode: 400 });
    }

    if (!phone) {
      throw Object.assign(new Error("Phone is required"), { statusCode: 400 });
    }

    const checkPhone = isValidPhoneNumber(phone);

    if (!checkPhone.status) {
      throw Object.assign(new Error(checkPhone.message), { statusCode: 400 });
    }

    if (_id) {
      if (!sno) {
        throw Object.assign(new Error("S No is required"), { statusCode: 400 });
      }

      const restaurent = await RestaurentModel.findById(_id);

      if (!restaurent) {
        throw Object.assign(new Error("Restaurent not found"), {
          statusCode: 404,
        });
      }

      if (sno < restaurent.sno) {
        await RestaurentModel.updateMany(
          { sno: { $gte: sno, $lt: restaurent.sno } },
          { $inc: { sno: 1 } },
          { session },
        );
      }

      if (sno > restaurent.sno) {
        await RestaurentModel.updateMany(
          { sno: { $gt: restaurent.sno, $lte: sno } },
          { $inc: { sno: -1 } },
          { session },
        );
      }

      // Log image input details without printing the complete image data.
      console.log("Restaurant logo type:", typeof logo);
      console.log(
        "Restaurant logo data URL:",
        typeof logoImageData === "string" &&
          logoImageData.startsWith("data:image/"),
      );
      console.log("Restaurant banner type:", typeof banner);
      console.log(
        "Restaurant banner data URL:",
        typeof bannerImageData === "string" &&
          bannerImageData.startsWith("data:image/"),
      );

      const uploadedLogo = await uploadImage(
        logoImageData,
        "braj_deals/restaurent/logos",
        1024 * 1024,
      );

      console.log(
        "Restaurant logo upload result:",
        uploadedLogo
          ? {
              hasSecureUrl: Boolean(uploadedLogo.secure_url),
              hasPublicId: Boolean(uploadedLogo.public_id),
            }
          : null,
      );

      const uploadedBanner = await uploadImage(
        bannerImageData,
        "braj_deals/restaurent/banners",
        1024 * 1024 * 2,
      );

      console.log(
        "Restaurant banner upload result:",
        uploadedBanner
          ? {
              hasSecureUrl: Boolean(uploadedBanner.secure_url),
              hasPublicId: Boolean(uploadedBanner.public_id),
            }
          : null,
      );

      const updatedRestaurent = await RestaurentModel.findByIdAndUpdate(
        _id,
        {
          sno: maxSno?.sno >= sno ? sno : maxSno?.sno,
          title,
          slug: title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          category,
          description,
          logo:
            uploadedLogo?.secure_url && uploadedLogo?.public_id
              ? {
                  url: uploadedLogo.secure_url,
                  publicId: uploadedLogo.public_id,
                }
              : restaurent.logo,
          banner:
            uploadedBanner?.secure_url && uploadedBanner?.public_id
              ? {
                  url: uploadedBanner.secure_url,
                  publicId: uploadedBanner.public_id,
                }
              : restaurent.banner,
          mapLink,
          location,
          shortLocation,
          email,
          phone,
          isVeg,
        },
        { new: true, session },
      );

      await session.commitTransaction();
      session.endSession();
      session = null;

      if (uploadedLogo?.secure_url && restaurent.logo?.publicId) {
        await deleteImage(restaurent.logo.publicId);
      }

      if (uploadedBanner?.secure_url && restaurent.banner?.publicId) {
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
    const snoPresent = await RestaurentModel.findOne({ sno });

    if (snoPresent) {
      await RestaurentModel.updateMany(
        { sno: { $gte: sno } },
        { $inc: { sno: 1 } },
        { session },
      );
    }

    // Diagnostic logs: inspect the image values received from the frontend.
    console.log("Restaurant logo type:", typeof logo);
    console.log(
      "Restaurant logo data URL:",
      typeof logoImageData === "string" &&
        logoImageData.startsWith("data:image/"),
    );
    console.log("Restaurant banner type:", typeof banner);
    console.log(
      "Restaurant banner data URL:",
      typeof bannerImageData === "string" &&
        bannerImageData.startsWith("data:image/"),
    );

    const uploadedLogo = await uploadImage(
      logoImageData,
      "braj_deals/restaurent/logos",
      1024 * 1024,
    );

    console.log(
      "Restaurant logo upload result:",
      uploadedLogo
        ? {
            hasSecureUrl: Boolean(uploadedLogo.secure_url),
            hasPublicId: Boolean(uploadedLogo.public_id),
          }
        : null,
    );

    if (!uploadedLogo?.secure_url || !uploadedLogo?.public_id) {
      throw new Error(
        "Logo upload failed. Check the frontend image format and uploadImage utility.",
      );
    }

    const uploadedBanner = await uploadImage(
      bannerImageData,
      "braj_deals/restaurent/banners",
      1024 * 1024 * 2,
    );

    console.log(
      "Restaurant banner upload result:",
      uploadedBanner
        ? {
            hasSecureUrl: Boolean(uploadedBanner.secure_url),
            hasPublicId: Boolean(uploadedBanner.public_id),
          }
        : null,
    );

    if (!uploadedBanner?.secure_url || !uploadedBanner?.public_id) {
      await deleteImage(uploadedLogo.public_id);
      throw new Error(
        "Banner upload failed. Check the frontend image format and uploadImage utility.",
      );
    }

    const newRestaurent = new RestaurentModel({
      sno: sno ? sno : maxSno?.sno ? maxSno.sno + 1 : 1,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      category,
      description,
      logo: {
        url: uploadedLogo.secure_url,
        publicId: uploadedLogo.public_id,
      },
      banner: {
        url: uploadedBanner.secure_url,
        publicId: uploadedBanner.public_id,
      },
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
    session = null;

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
    if (session) {
      try {
        await session.abortTransaction();
      } catch (transactionError) {
        console.error("Transaction rollback failed:", transactionError);
      }

      session.endSession();
    }

    console.error("Restaurant creation failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Something went wrong",
      },
      { status: error.statusCode || 500 },
    );
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
    const galleriesPublicIds = galleries.map(
      (gallery) => gallery.image.publicId,
    );

    await GalleryModel.deleteMany({ restaurentId: _id }, { session });

    await session.commitTransaction();
    session.endSession();

    await bulkDeleteImages([
      ...galleriesPublicIds,
      deleted.logo.publicId,
      deleted.banner.publicId,
    ]);

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
