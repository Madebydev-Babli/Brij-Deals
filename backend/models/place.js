import mongoose from "mongoose";

const artiTimingSchema = new mongoose.Schema(
    {
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

const placeSchema = new mongoose.Schema(
    {
        sno: {
            type: Number,
            required: true,
        },

        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
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

        history: {
            type: String,
            required: [true, "History is required"],
            trim: true,
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

        banner: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },

        openingTime: {
            type: String,
            required: [true, "Opening time is required"],
            trim: true,
        },

        closingTime: {
            type: String,
            required: [true, "Closing time is required"],
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