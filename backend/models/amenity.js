import { RESTAURANT_AMENITIES_ENUM } from '@/utility/utility-data';
import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({

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
        enum: RESTAURANT_AMENITIES_ENUM.map(elem => elem.title)
    },

}, {
    timestamps: true
});

export const AmenityModel = mongoose.models.Amenity || mongoose.model('Amenity', amenitySchema);