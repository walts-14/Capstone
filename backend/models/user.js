import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    age: {
        type: Number,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true,})

const User = mongoose.model('User', userSchema)

export default User;