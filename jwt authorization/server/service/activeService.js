import {v4} from "uuid";
import Active from "../models/activeModel.js";
import ApiError from "../exception/apiError.js";

export default new class ActiveService {
    
    async link(userId) {
        let activeData = await Active.findOne({user: userId})
        if(!activeData) {
            const activationLink = v4();
            activeData = await Active.create({user: userId, activationLink});
        }
        return activeData;
    }

    async activate(activationLink) {
        const activeData = await Active.findOne({activationLink});
        if(!activeData) {
            throw ApiError.BadRequest(`Неккоректная ссылка активации`);
        }
        activeData.isActivated = true;
        await activeData.save();
    }
}