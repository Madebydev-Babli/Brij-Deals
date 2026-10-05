import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true, trim: true },
        publicId: { type: String, default: "" },
    },
    { _id: false }
);

const offerSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        endDate: { type: String, trim: true },
    },
    { _id: false }
);

const amenitySchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        icon: { type: String, trim: true },
    },
    { _id: false }
);

const attractionSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true },
        distance: { type: String, trim: true },
        time: { type: String, trim: true },
        mode: { type: String, trim: true },
    },
    { _id: false }
);

const roomGallerySchema = new mongoose.Schema(
    {
        image: { type: imageSchema, default: null },
        label: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const roomCategorySchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        heroImage: { type: imageSchema, default: null },
        gallery: { type: [roomGallerySchema], default: [] },
        size: { type: String, trim: true },
        bedType: { type: String, trim: true },
        bedQuantity: { type: Number, default: 1 },
        guests: { type: Number, default: 1 },
        price: { type: String, trim: true },
        amenities: { type: [String], default: [] },
    },
    { _id: false }
);

const hotelGallerySchema = new mongoose.Schema(
    {
        image: { type: imageSchema, default: null },
        label: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

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
        required: [true, "Starting Price is required"],
        default: 0,
    },
    roomCategories: {
        type: [roomCategorySchema],
        default: [],
    },
    offers: {
        type: [offerSchema],
        default: [],
    },
    amenities: {
        type: [amenitySchema],
        default: [],
    },
    attractions: {
        type: [attractionSchema],
        default: [],
    },
    gallery: {
        type: [hotelGallerySchema],
        default: [],
    },
}, {
    timestamps: true,
});

export const HotelModel = mongoose.models.Hotel || mongoose.model('Hotel', schema);