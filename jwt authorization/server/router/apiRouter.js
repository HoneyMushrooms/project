import { Router } from "express";
import ApiController from "../controllers/apiController.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.post('/registration', body('email').isEmail(), body('password').isLength({min:3}), ApiController.registration);
router.post('/login', body('email').notEmpty(), body('password').notEmpty(), ApiController.login);
router.post('/logout', ApiController.logout);
router.get('/activate/:link', ApiController.active);
router.get('/refresh', ApiController.refresh);
router.get('/users', authMiddleware, ApiController.getUsers);

export default router;