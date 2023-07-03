import { Schema, model } from "mongoose";
import timeZone from "mongoose-timezone";

const Message = new Schema({
    msg: {
        type: { type: String, required: true },
        textOrPathToFile: {type: String, required: true}, 
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
    },
    
}, {versionKey: false, timestamps: true})

Message.plugin(timeZone);
export default model('Message', Message);