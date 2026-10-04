import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({

    sno: {
        type: Number,
        required: true,
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
        required: [true, "Description is required"],
        trim: true,
    },

    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },

    image: {

        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        }

    },

    date: {
        type: String,
        required: [true, "Date is required"],
        trim: true,
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
    }

}, {
    timestamps: true
});

export const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema);