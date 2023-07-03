import { Router } from "express";
import AuthController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import limitMiddleware from "../middleware/limitMiddleware.js";

const router = new Router();

router.post('/registration', AuthController.registration);
router.post('/login', limitMiddleware, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/refresh', AuthController.refresh);
router.get('/contacts', authMiddleware, AuthController.getContacts);
router.patch('/user/:id', AuthController.updateUser)

export default router;