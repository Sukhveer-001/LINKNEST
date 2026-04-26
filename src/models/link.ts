import mongoose, { Schema, Model, models, Types } from "mongoose";
import { ILink } from "@/types/auth";

const linkSchema = new Schema<ILink>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Link: Model<ILink> =
    models.Link || mongoose.model<ILink>("Link", linkSchema);

export default Link;