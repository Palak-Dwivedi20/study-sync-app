import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,   //cloudinary url
            default: ""
        },
        avatarPublicId: {
            type: String,   //cloudinary
            default: ""
        },
        coverImage: {
            type: String,   //cloudinary url
            default: ""
        },
        coverImagePublicId: {
            type: String,   //cloudinary
            default: ""
        },
        cloudinaryType: {
            type: String,
            default: "image"
        },
        bio: {
            type: String
        },
        isProfileCompleted: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["student", "groupleader"],
            default: "student"
        },
        joinedGroups: [
            {
                type: Schema.Types.ObjectId,
                ref: "Group"
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//create a custom method to check password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


//create a custom method to generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


//create a custom method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);