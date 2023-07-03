import Group from "../model/groupModel.js";

export default new class GroupService {

    async findGroup(name) {
        let groupData = await Group.findOne({name});
        if(!groupData) {
            groupData = this.createGroup(name);
        }
        return groupData;
    }

    async findGroupById(id) {
        let groupData = await Group.findById(id);
        return groupData;
    }

    async createGroup(name) {
        const groupData = await Group.create({name});
        return groupData;
    }
}