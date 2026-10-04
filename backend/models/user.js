import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        select: false,
    },

    isLoggedIn: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

schema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

schema.pre('findOneAndUpdate', async function () {

    const update = this.getUpdate();

    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
        this.setUpdate(update);
    }
});

export const UserModel = mongoose.models.User || mongoose.model('User', schema); 