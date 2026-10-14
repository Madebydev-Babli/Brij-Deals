import mongoose from "mongoose";

const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

export const BlogCategoryModel =
  mongoose.models.BlogCategory ||
  mongoose.model("BlogCategory", BlogCategorySchema);
