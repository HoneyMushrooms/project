import { Schema, model } from "mongoose";

const User = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    cardId: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    group: {type: Schema.Types.ObjectId, ref: 'Group', required: true},
}, {versionKey: false})

export default model('User', User);
