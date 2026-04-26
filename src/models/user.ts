import mongoose, { Schema, Document, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/auth";

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        username: {
            type: String,
            // required: true,
            unique: true,
            lowercase: true,
            index: true,
            sparse: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        bio: {
            type: String,
            maxlength: 160,
            default: "",
        },
        isSetupComplete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


UserSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;

    const SALT_ROUNDS = 10;

    this.password = await bcrypt.hash(
        this.password,
        SALT_ROUNDS
    );

});

UserSchema.methods.comparePassword =
    async function (this: HydratedDocument<IUser>, candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(
            candidatePassword,
            this.password
        );
    };
const User: Model<IUser> =
    mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);

export default User;