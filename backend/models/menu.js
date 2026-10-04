import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({

    restaurentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent",
        default: null,
    },

    sno: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },

}, {
    timestamps: true
});

export const MenuModel = mongoose.models.Menu || mongoose.model('Menu', menuSchema);