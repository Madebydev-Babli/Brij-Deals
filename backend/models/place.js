import mongoose from "mongoose";

function createSlug(title) {
    return title
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const artiTimingSchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            min: 1,
        },
        name: {
            type: String,
            required: [true, "Aarti name is required"],
            trim: true,
        },
        time: {
            type: String,
            required: [true, "Aarti time is required"],
            trim: true,
        },
    },
    { _id: false }
);

const gallerySchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            min: 1,
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        title: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const attractionSchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            min: 1,
        },
        title: {
            type: String,
            required: [true, "Attraction title is required"],
            trim: true,
        },
        distance: {
            type: String,
            trim: true,
        },
        time: {
            type: String,
            trim: true,
        },
        mode: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const visitorTipSchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            min: 1,
        },
        icon: {
            type: String,
            trim: true,
        },
        label: {
            type: String,
            required: [true, "Visitor tip label is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Visitor tip description is required"],
            trim: true,
        },
    },
    { _id: false }
);

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const placeSchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            required: true,
            min: [1, "S.No. must be a positive integer"],
            validate: {
                validator: Number.isInteger,
                message: "S.No. must be a positive integer",
            },
        },

        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            default: function () {
                return createSlug(this.title);
            },
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        history: {
            type: String,
            trim: true,
        },

        image: {
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

        openingTime: {
            type: String,
            trim: true,
        },

        closingTime: {
            type: String,
            trim: true,
        },

        artiTimings: {
            type: [artiTimingSchema],
            default: [],
        },

        gallery: {
            type: [gallerySchema],
            default: [],
        },

        mapEmbed: {
            type: String,
            trim: true,
        },

        mapLink: {
            type: String,
            trim: true,
        },

        attractions: {
            type: [attractionSchema],
            default: [],
        },

        visitorTips: {
            type: [visitorTipSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const PlaceModel =
    mongoose.models.Place || mongoose.model("Place", placeSchema);