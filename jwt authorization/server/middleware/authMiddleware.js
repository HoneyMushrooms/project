import ApiError from "../exception/apiError.js";
import tokenService from "../service/tokenService.js";

export default function authMiddleware(req, res, next) {
    try {
        if(!req.headers.authorization) {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = req.headers.authorization.split(' ')[1];
        if(!accessToken) {
            throw ApiError.UnauthorizedError();
        }
        console.log(1)
        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            throw ApiError.UnauthorizedError();
        }
        
        req.user = userData;
        next();
    } catch(e) {
        next(e)
    }
}