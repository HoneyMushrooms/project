import { Schema, model } from "mongoose";

const Active = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
}, {versionKey: false})

export default model('Active', Active);