import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true, trim: true },
        publicId: { type: String, default: "" },
    },
    { _id: false }
);

const attractionSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true, default: "" },
        distance: { type: String, trim: true, default: "" },
        time: { type: String, trim: true, default: "" },
        mode: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        title: { type: String, trim: true, default: "" },
        description: { type: String, trim: true, default: "" },
        price: { type: String, trim: true, default: "" },
        originalPrice: { type: String, trim: true, default: "" },
        offer: { type: String, trim: true, default: "" },
        image: { type: imageSchema, default: null },
        highlights: { type: [String], default: [] },
    },
    { _id: true }
);

const schema = new mongoose.Schema(
    {
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
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        image: {
            type: imageSchema,
            default: null,
        },
        logo: {
            type: imageSchema,
            default: null,
        },
        banner: {
            type: imageSchema,
            default: null,
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
        },
        mapLink: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            default: "",
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        whatsapp: {
            type: String,
            trim: true,
            default: "",
        },
        instagram: {
            type: String,
            trim: true,
            default: "",
        },
        facebook: {
            type: String,
            trim: true,
            default: "",
        },
        youtube: {
            type: String,
            trim: true,
            default: "",
        },
        website: {
            type: String,
            trim: true,
            default: "",
        },
        openingTime: {
            type: String,
            trim: true,
            default: "",
        },
        closingTime: {
            type: String,
            trim: true,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        googleReview: {
            type: String,
            trim: true,
            default: "",
        },
        startingPrice: {
            type: Number,
            default: 0,
        },
        attractions: {
            type: [attractionSchema],
            default: [],
        },
        products: {
            type: [productSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const ReligiousShopModel = mongoose.models.ReligiousShop || mongoose.model('ReligiousShop', schema);
