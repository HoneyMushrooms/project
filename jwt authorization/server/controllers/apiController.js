import userService from "../service/userService.js";
import activeService from "../service/activeService.js";
import tokenService from "../service/tokenService.js";
import { validationResult } from "express-validator";
import ApiError from "../exception/apiError.js";

export default new class ApiController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw ApiError.BadRequest('Не прошла валидация', errors.array())
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            
            return res.status(200).cookie('refresh', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}).json(userData);
        } catch(e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw ApiError.BadRequest('Поля не могут быть пустыми', errors.array())
            }
            const {email, password} = req.body;
            const userData = await userService.login(email, password);

            return res.status(200).cookie('refresh', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}).json(userData);
        } catch(e) {
            next(e);
        }
    }
    
    async logout(req, res, next) {
        try {
            const {refresh} = req.cookies;
            await tokenService.logout(refresh);
            res.clearCookie('refresh')
            res.sendStatus(200);
        } catch(e) {
            next(e)
        }
    }

    async active(req, res, next) {
        try {
            const activationLink = req.params.link;
            await activeService.activate(activationLink);

            return res.redirect(301, process.env.CLIENT_URL);
        } catch(e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refresh} = req.cookies;
            const userData = await userService.refresh(refresh);

            return res.status(200).cookie('refresh', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true}).json(userData);
        } catch(e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            console.log(req.user)
            return res.status(200).json(users);
        } catch(e) {
            next(e)
        }
    }
}