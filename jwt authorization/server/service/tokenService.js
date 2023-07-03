import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";

export default new class TokenService {
    
    generationTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = Token.create({user: userId, refreshToken});
        return token;
    }

    async logout(refresh) {
        await Token.deleteOne({refresh})
    }

    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch(e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch(e) {
            return null;
        }
    }

    async findToken(refresh) {
        const tokenData = await Token.findOne({refresh});
        return tokenData;
    }
}