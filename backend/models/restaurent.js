import {
  LOCATION_ENUM,
  RESTAURANT_CATEGORIES_ENUM,
} from "@/utility/utility-data";
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const restaurentSchema = new mongoose.Schema(
  {
    sno: {
      type: Number,
      required: true,
      min: [1, "S.No. must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "S.No. must be a positive integer",
      },
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: RESTAURANT_CATEGORIES_ENUM,
    },

    description: {
      type: String,

      trim: true,
    },

    logo: {
      type: imageSchema,
      default: null,
    },

    banner: {
      type: imageSchema,
      default: null,
    },

    mapLink: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    shortLocation: {
      type: String,
      required: [true, "Short Location is required"],
      trim: true,
      enum: LOCATION_ENUM,
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    isVeg: {
      type: Boolean,
      required: [true, "Food type is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const RestaurentModel =
  mongoose.models.Restaurent || mongoose.model("Restaurent", restaurentSchema);
