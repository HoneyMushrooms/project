import { Schema, model } from "mongoose";

const Group = new Schema({
    name: {type: String, required: true, unique: true},
}, {versionKey: false})

export default model('Group', Group);
