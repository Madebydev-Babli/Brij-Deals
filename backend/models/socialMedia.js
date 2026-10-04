import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({

    restaurentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent",
        default: null,
    },

    whatsApp: {
        type: String,
        trim: true,
    },

    instagram: {
        type: String,
        trim: true,
    },

    facebook: {
        type: String,
        trim: true,
    },

    youtube: {
        type: String,
        trim: true,
    },

    website: {
        type: String,
        trim: true,
    },

    googleReviewLink: {
        type: String,
        trim: true,
    },

}, {
    timestamps: true
});

export const SocialMediaModel = mongoose.models.Social_Media || mongoose.model('Social_Media', socialMediaSchema);