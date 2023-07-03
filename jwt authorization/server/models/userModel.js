import { Schema, model } from "mongoose";

const User = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
}, {versionKey: false})

export default model('User', User);