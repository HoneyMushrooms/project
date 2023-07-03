import MessageService from "../service/messageService.js";

export default new class MessageController {
    async addMessage(req, res, next) {
        try {
            const {from, to, message} = req.body;
            await MessageService.addMessage(from, to, message);

            return res.sendStatus(201);
        } catch(e) {
            next(e);
        }
    }

    async getMessages(req, res, next) {
        try {
            const {from, to} = req.body;
            const messages = await MessageService.getMessages(from, to);
            
            res.json(messages);
        } catch(e) {
            next(e);
        }
    }

    async removeMessage(req, res, next) {
        try {
            const {id} = req.params;
            await MessageService.removeMessage(id);

            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }
}