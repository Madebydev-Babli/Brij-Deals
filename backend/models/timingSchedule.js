import mongoose from 'mongoose';

const timingScheduleSchema = new mongoose.Schema({

    restaurentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurent",
        default: null,
    },

    monday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    tuesday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    wednesday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    thursday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    friday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    saturday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

    sunday: {

        opening: {
            type: String
        },

        closing: {
            type: String
        }

    },

}, {
    timestamps: true
});

export const TimingScheduleModel = mongoose.models.Timing_Schedule || mongoose.model('Timing_Schedule', timingScheduleSchema);