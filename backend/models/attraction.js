import { TRAVEL_MODE_ENUM } from '@/utility/utility-data';
import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({

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

    distance: {
        type: String,
        required: true,
    },

    duration: {
        type: String,
        required: true,
    },

    mode: {
        type: String,
        required: [true, "mode is required"],
        trim: true,
        enum: TRAVEL_MODE_ENUM
    }

}, {
    timestamps: true
});

export const AttractionModel = mongoose.models.Attraction || mongoose.model('Attraction', attractionSchema);