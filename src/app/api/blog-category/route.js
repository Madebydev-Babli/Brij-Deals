import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import { BlogCategoryModel } from "../../../../backend/models/blog-category";
import { BlogModel } from "../../../../backend/models/blog";

function createCategorySlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function authorize(req) {
  const decoded = await verifyToken(req);
  return Boolean(decoded);
}

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await BlogCategoryModel.find({})
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      status: "success",
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unable to fetch categories",
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    if (!(await authorize(req))) {
      return NextResponse.json(
        { status: "error", message: "Please login" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = createCategorySlug(name);

    if (!name || !slug) {
      return NextResponse.json(
        { status: "error", message: "Enter a valid category name" },
        { status: 400 },
      );
    }

    const existing = await BlogCategoryModel.findOne({ slug });

    if (existing) {
      return NextResponse.json(
        { status: "error", message: "This category already exists" },
        { status: 409 },
      );
    }

    const category = await BlogCategoryModel.create({ name, slug });

    return NextResponse.json(
      {
        status: "success",
        message: "Category added successfully",
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unable to add category",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();

    if (!(await authorize(req))) {
      return NextResponse.json(
        { status: "error", message: "Please login" },
        { status: 401 },
      );
    }

    const { id, name: rawName } = await req.json();
    const name = typeof rawName === "string" ? rawName.trim() : "";
    const slug = createCategorySlug(name);

    if (!id || !name || !slug) {
      return NextResponse.json(
        {
          status: "error",
          message: "Category ID and a valid name are required",
        },
        { status: 400 },
      );
    }

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { status: "error", message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const category = await BlogCategoryModel.findById(id);

    if (!category) {
      return NextResponse.json(
        { status: "error", message: "Category not found" },
        { status: 404 },
      );
    }

    const duplicate = await BlogCategoryModel.findOne({
      slug,
      _id: { $ne: category._id },
    });

    if (duplicate) {
      return NextResponse.json(
        { status: "error", message: "This category already exists" },
        { status: 409 },
      );
    }

    const oldName = category.name;

    // Keep existing blog category strings in sync with the renamed category.
    if (oldName !== name) {
      await BlogModel.updateMany(
        { category: oldName },
        { $set: { category: name } },
      );
    }

    category.name = name;
    category.slug = slug;
    await category.save();

    return NextResponse.json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unable to update category",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();

    if (!(await authorize(req))) {
      return NextResponse.json(
        { status: "error", message: "Please login" },
        { status: 401 },
      );
    }

    const id = new URL(req.url).searchParams.get("id");

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { status: "error", message: "A valid category ID is required" },
        { status: 400 },
      );
    }

    const category = await BlogCategoryModel.findById(id);

    if (!category) {
      return NextResponse.json(
        { status: "error", message: "Category not found" },
        { status: 404 },
      );
    }

    const assignedBlog = await BlogModel.exists({
      category: category.name,
    });

    if (assignedBlog) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "This category is assigned to blogs. Reassign those blogs before deleting it.",
        },
        { status: 409 },
      );
    }

    await BlogCategoryModel.findByIdAndDelete(id);

    return NextResponse.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unable to delete category",
      },
      { status: 500 },
    );
  }
}
