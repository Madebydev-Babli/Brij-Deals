import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({

    restaurentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent",
        default: null,
    },

    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
    },

    sno: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

}, {
    timestamps: true
});

export const MenuItemModel = mongoose.models.Menu_Item || mongoose.model('Menu_Item', menuItemSchema);