import mongoose from "mongoose";
import {
  hasMeaningfulBlogContent,
  isValidBlogDate,
} from "../../src/utility/blog-validation.js";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    sno: {
      type: Number,
      required: [true, "S.No. is required"],
      min: [1, "S.No. must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "S.No. must be a positive integer",
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
      validate: {
        validator: hasMeaningfulBlogContent,
        message: "Blog content is required",
      },
    },
    image: {
      type: imageSchema,
      default: null,
      set(image) {
        return image === "" ? null : image;
      },
      validate: {
        validator(image) {
          return image == null
            || (!image.url && !image.publicId)
            || Boolean(image.url && image.publicId);
        },
        message: "Blog image must include both a URL and public ID",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
      validate: {
        validator: isValidBlogDate,
        message: "Date must be a valid date in YYYY-MM-DD format",
      },
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BlogModel =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema);
