import mongoose from 'mongoose';

const offerSchemaSchema = new mongoose.Schema({

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

    description: {
        type: String,
        required: true,
    },

    endDate: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
});

export const OfferModel = mongoose.models.Offer || mongoose.model('Offer', offerSchemaSchema);