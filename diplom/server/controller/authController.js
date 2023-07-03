import UserService from "../service/userService.js"

export default new class AuthController {

    async registration(req, res, next) {
        try {
            const {name, surname, cardId, password, group} = req.body;
            const userData = await UserService.registration(name, surname, cardId, password, group)

            return res.status(201)
               .cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
               .json(userData);
        } catch(e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {cardId, password} = req.body;
            const userData = await UserService.login(cardId, password)

            return res.status(200)
               .cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
               .json(userData);
        } catch(e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);

            return res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
               .json(userData);
        } catch(e) {
            next(e);
        }
    }

    
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await UserService.logout(refreshToken);

            return res.clearCookie('refreshToken')
               .sendStatus(200);
        } catch(e) {
            next(e);
        }
    }

    
    async getContacts(req, res, next) {
        try {
            const {id, group} = req.query;
            const contacts = await UserService.getContacts(id, group);

            return res.json(contacts);
        } catch(e) {
            next(e)
        }
    }

    async updateUser(req, res, next) {
        try {
            const {id} = req.params;
            const {name, surname} = req.body;
            await UserService.updateUser(id, name, surname);

            res.sendStatus(204);
        } catch(e) {
            next(e);
        } 
    }
}