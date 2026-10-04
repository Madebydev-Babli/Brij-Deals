import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({

    sno: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },

    link: {
        type: String,
        required: [true, "Link is required"],
        trim: true,
    },

    button: {
        type: String,
        required: [true, "Button is required"],
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

    }

}, {
    timestamps: true
});

export const BannerModel = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);