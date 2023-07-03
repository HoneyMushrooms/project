import Message from "../model/messageModel.js";
import ApiError from "../exception/apiError.js";
import FileService from "./fileService.js";

const messageDto = (messages) => messages.map((msg) => ({id:msg._id, sender: msg.sender,msg: msg.msg,time: msg.createdAt}))

export default new class MessageController {

    async addMessage(from, to, msg) {
        if(!from || !to?.type || !to?.recipient || !msg?.type || !msg?.textOrPathToFile) {
            throw ApiError.BadRequest('Некорректные данные');
        }

        let messageData;
        if(to.type === 'User') {
            messageData = await Message.create({msg, sender: from, user: to.recipient});
        } else if(to.type === 'Group') {
            messageData = await Message.create({msg, sender: from, group: to.recipient});
        } else {
            throw ApiError.BadRequest('Некорректные данные получателя');
        }
        if(!messageData){
            throw ApiError.BadRequest('Cообщение не сохранилось, что-то пошло не так');
        }
    }

    async getMessages(from, to) {
        if(!from || !to?.type || !to?.recipient) {
            throw ApiError.BadRequest('Некорректные данные');
        }
        let messages, messagesData;
        if(to.type === 'User') {
            messagesData = await Message.find({$or:[
                {sender: from, user: to.recipient},
                {sender: to.recipient, user: from},
            ]})
            messages = messageDto(messagesData);
        } else if(to.type === 'Group') {
            messagesData = await Message.find({group: to.recipient});
            messages = messageDto(messagesData);
        } else {
            throw ApiError.BadRequest('Некорректные данные');
        }

        return messages;
    }

    async removeMessage(id) {
        const messageData = await Message.findById(id);
        if(!messageData) {
            throw ApiError.BadRequest('Сообщения не существует');
        }
        if(messageData.msg.type === 'text') {
            await messageData.deleteOne();
        } else {
            await FileService.removeFile(messageData.msg.textOrPathToFile);
            await messageData.deleteOne();
        }
    }
}