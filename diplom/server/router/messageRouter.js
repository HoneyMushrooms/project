import { Router } from "express";
import MessageController from "../controller/messageController.js";

const router = new Router();

router.post('/addmsg', MessageController.addMessage);
router.post('/getmsg', MessageController.getMessages);
router.delete('/:id', MessageController.removeMessage);

export default router;