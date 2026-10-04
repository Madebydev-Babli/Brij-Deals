import { LOCATION_ENUM, RESTAURANT_CATEGORIES_ENUM } from '@/utility/utility-data';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    sno: {
        type: Number,
        required: true,
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
        required: [true, "Description is required"],
        trim: true,
    },

    logo: {

        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        }

    },

    banner: {

        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        }

    },

    mapLink: {
        type: String,
        trim: true,
    },

    location: {
        type: String,
        required: [true, "Location is required"],
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
        required: [true, "Email is required"],
        trim: true,
    },

    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
    },

    startingPrice: {
        type: Number,
        required: [true, "Starting Price is required"],
    },

    isVeg: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true
});

export const HotelModel = mongoose.models.Hotel || mongoose.model('Hotel', schema);