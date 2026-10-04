import { NextResponse } from "next/server";
import connectToDatabase from "../../../../backend/configurations/mongoose.config";
import { verifyToken } from "../../../../backend/middlewares/verify-token";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { BlogModel } from "../../../../backend/models/blog";
import {
    clearSearch,
    deleteImage,
    getErrorMessage,
    uploadImage
} from "@/utility/server-utility";

function createSlug(value) {
    return (value || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
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

export async function POST(req) {

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
                    error: "Unauthorized access"
                },
                { status: 401 }
            );
        }

        const {
            _id,
            sno,
            title,
            slug,
            description,
            content,
            image,
            date,
            author,
            category
        } = await req.json();

        const normalizedSlug = createSlug(slug || title);

        if (!title) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Title is required",
                    data: null,
                    error: "Title is required"
                },
                { status: 400 }
            );
        }

        if (!normalizedSlug) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Valid title is required",
                    data: null,
                    error: "Valid title is required"
                },
                { status: 400 }
            );
        }

        if (!description) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Description is required",
                    data: null,
                    error: "Description is required"
                },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Content is required",
                    data: null,
                    error: "Content is required"
                },
                { status: 400 }
            );
        }

        if (!image) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Image is required",
                    data: null,
                    error: "Image is required"
                },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Date is required",
                    data: null,
                    error: "Date is required"
                },
                { status: 400 }
            );
        }

        if (!author) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Author is required",
                    data: null,
                    error: "Author is required"
                },
                { status: 400 }
            );
        }

        if (!category) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Category is required",
                    data: null,
                    error: "Category is required"
                },
                { status: 400 }
            );
        }

        /*
         * UPDATE BLOG
         */
        if (_id) {

            if (!sno) {
                return NextResponse.json(
                    {
                        status: "error",
                        message: "S No is required",
                        data: null,
                        error: "S No is required"
                    },
                    { status: 400 }
                );
            }

            const blog = await BlogModel.findById(_id);

            if (!blog) {
                return NextResponse.json(
                    {
                        status: "error",
                        message: "Blog not found",
                        data: null,
                        error: "Blog not found"
                    },
                    { status: 404 }
                );
            }

            const existingSlug = await BlogModel.findOne({
                slug: normalizedSlug,
                _id: { $ne: _id }
            });

            if (existingSlug) {
                return NextResponse.json(
                    {
                        status: "error",
                        message: "Slug already exists",
                        data: null,
                        error: "Slug already exists"
                    },
                    { status: 400 }
                );
            }

            const uploadedImage = image && image.data
                ? normalizeUploadedImage(
                    await uploadImage(
                        image.data,
                        "braj_deals/blogs",
                        1024 * 1024 * 2
                    )
                )
                : null;

            await BlogModel.findByIdAndUpdate(
                _id,
                {
                    sno,
                    title,
                    slug: normalizedSlug,
                    description,
                    content,
                    date,
                    author,
                    category,
                    image: uploadedImage || blog.image
                },
                {
                    new: true,
                    session
                }
            );

            await session.commitTransaction();
            session.endSession();

            if (uploadedImage && blog?.image?.publicId && blog.image.publicId !== uploadedImage.publicId) {
                await deleteImage(blog.image.publicId);
            }

            revalidatePath("/");
            revalidatePath("/blogs");
            revalidatePath(`/blogs/${slug}`);

            return NextResponse.json(
                {
                    status: "success",
                    message: "Blog updated successfully",
                    data: null,
                    error: null
                },
                { status: 200 }
            );

        } else {

            /*
             * CREATE BLOG
             */

            const existingSlug = await BlogModel.findOne({ slug: normalizedSlug });

            if (existingSlug) {
                return NextResponse.json(
                    {
                        status: "error",
                        message: "Slug already exists",
                        data: null,
                        error: "Slug already exists"
                    },
                    { status: 400 }
                );
            }

            const maxSno = await BlogModel.findOne({}).sort({ sno: -1 });

            const snoPresent = await BlogModel.findOne({ sno });

            if (snoPresent) {
                await BlogModel.updateMany(
                    { sno: { $gte: sno } },
                    { $inc: { sno: 1 } },
                    { session }
                );
            }

            const uploadedImage = image && image.data
                ? normalizeUploadedImage(
                    await uploadImage(
                        image.data,
                        "braj_deals/blogs",
                        1024 * 1024 * 2
                    )
                )
                : null;

            if (!uploadedImage) {
                throw new Error("Image upload failed");
            }

            const newBlog = new BlogModel({
                sno: sno
                    ? sno
                    : maxSno?.sno
                        ? maxSno.sno + 1
                        : 1,
                title,
                slug: normalizedSlug,
                description,
                content,
                image: uploadedImage,
                date,
                author,
                category
            });

            await newBlog.save({ session });

            await session.commitTransaction();
            session.endSession();

            revalidatePath("/");
            revalidatePath("/blogs");

            return NextResponse.json(
                {
                    status: "success",
                    message: "Blog added successfully",
                    data: null,
                    error: null
                },
                { status: 201 }
            );
        }

    } catch (error) {

        const errorMessage = await getErrorMessage(error, session);

        return NextResponse.json(
            {
                status: "error",
                data: null,
                message: errorMessage,
                error: errorMessage
            },
            { status: 500 }
        );
    }
}


export async function GET(req) {

    try {

        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const {
            _id,
            slug,
            sortOrder = -1,
            sortKey = "createdAt",
            limit = 10,
            page = 1,
            searchValue = ""
        } = Object.fromEntries(searchParams.entries());

        const search = {

            _id: mongoose.Types.ObjectId.isValid(_id)
                ? _id
                : undefined,

            slug: slug || undefined,

            $or: [
                {
                    title: {
                        $regex: new RegExp(searchValue || ""),
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: new RegExp(searchValue || ""),
                        $options: "i"
                    }
                },
                {
                    author: {
                        $regex: new RegExp(searchValue || ""),
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: new RegExp(searchValue || ""),
                        $options: "i"
                    }
                }
            ]
        };

        clearSearch(search);

        const blogs = await BlogModel
            .find(search)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({
                [sortKey]: Number(sortOrder)
            })
            .lean();

        const totalFilteredData = await BlogModel
            .find(search)
            .countDocuments();

        const totalData = await BlogModel
            .find({})
            .countDocuments();

        const extra = {
            page: String(page),
            limit: String(limit),
            totalFilteredData: String(totalFilteredData),
            totalData: String(totalData),
            totalPages: String(
                Math.ceil(totalFilteredData / Number(limit))
            )
        };

        return NextResponse.json(
            {
                status: "success",
                message: "Blogs fetched successfully",
                data: {
                    data: blogs.map((item) => ({
                        ...item,
                        image: item.image.url
                    })),
                    extra
                },
                error: null
            },
            {
                status: 200
            }
        );

    } catch (error) {

        const errorMessage = await getErrorMessage(error);

        return NextResponse.json(
            {
                status: "error",
                data: null,
                message: errorMessage,
                error: errorMessage
            },
            { status: 500 }
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
                    error: "Unauthorized access"
                },
                { status: 401 }
            );
        }

        const { _id } = await req.json();

        if (!_id) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "_id is required",
                    data: null,
                    error: "_id is required"
                },
                { status: 400 }
            );
        }

        const deleted = await BlogModel.findByIdAndDelete(
            _id,
            { session }
        );

        if (!deleted) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Blog not found",
                    data: null,
                    error: "Blog not found"
                },
                { status: 404 }
            );
        }

        await BlogModel.updateMany(
            { sno: { $gt: deleted.sno } },
            { $inc: { sno: -1 } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        await deleteImage(deleted.image.publicId);

        revalidatePath("/");
        revalidatePath("/blogs");
        revalidatePath(`/blogs/${deleted.slug}`);

        return NextResponse.json(
            {
                status: "success",
                message: "Blog deleted successfully",
                data: null,
                error: null
            },
            { status: 200 }
        );

    } catch (error) {

        const errorMessage = await getErrorMessage(error, session);

        return NextResponse.json(
            {
                status: "error",
                data: null,
                message: errorMessage,
                error: errorMessage
            },
            { status: 500 }
        );
    }
}