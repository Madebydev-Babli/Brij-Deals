import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({

    sno: {
        type: Number,
        required: true,
    },

    page: {
        type: String,
        required: [true, "Page is required"],
        trim: true,
    },

    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
    },

    answer: {
        type: String,
        required: [true, "Answer is required"],
        trim: true,
    },

}, {
    timestamps: true
});

export const FaqModel = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);