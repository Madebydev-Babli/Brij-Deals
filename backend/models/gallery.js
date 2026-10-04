import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({

    restaurentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent",
        default: null,
    },

    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        default: null,
    },

    sno: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: [true, "Title is required"],
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

export const GalleryModel = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);