import ApiError from "../exception/apiError.js";
import TokenService from "../service/tokenService.js";

export default function (req, res, next) {
    try {
        if(!req.get('authorization')) {
            return next(ApiError.UnauthorizedError());
        }
        const typeToken = req.get('authorization').split(' ')[0];
        const accessToken = req.get('authorization').split(' ')[1];
        if(typeToken !== 'Bearer' || !accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        const userData = TokenService.validateAccessToken(accessToken);
        if(!userData) {
            return next(ApiError.UnauthorizedError());
        }
        
        req.user = userData;
        next();
    } catch(e) {
        next(e);
    }
}