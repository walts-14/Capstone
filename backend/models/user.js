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
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },

})

const User = mongoose.model('User', userSchema);

export default User;