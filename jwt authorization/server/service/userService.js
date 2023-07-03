import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import MailService from "./mailService.js"
import TokenService from "./tokenService.js";
import ActiveService from "./activeService.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exception/apiError.js";
import tokenService from "./tokenService.js";

export default new class UserService {

    async registration(email, password) {
        const candidate = await User.findOne({email});
        if(candidate) {
            throw ApiError.BadRequest(`Пользователь с таким ${email} почтовым адресом уже существует`);
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        const user = await User.create({email, password: hashPassword});
        
        const activeDate = await ActiveService.link(user._id);
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activeDate.activationLink}`);

        const userDto = new UserDto(user, activeDate);
        const tokens = TokenService.generationTokens({...userDto});
        await TokenService.saveToken(user._id, tokens.refreshToken);

        return {tokens, user: userDto}
    }

    async login(email, password) {
        const user = await User.findOne({email});
        if(!user) {
            throw ApiError.BadRequest(`Пользователь с таким ${email} почтовым адресом не существует`)
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            throw ApiError.BadRequest("Введен неверный пароль");
        }

        const activeDate = await ActiveService.link(user._id);
        const userDto = new UserDto(user, activeDate);
        
        const tokens = TokenService.generationTokens({...userDto});
        await TokenService.saveToken(user._id, tokens.refreshToken);

        return {tokens, user: userDto}
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.id)
        const activeDate = await ActiveService.link(user._id);
        const userDto = new UserDto(user, activeDate);
        const tokens = TokenService.generationTokens({...userDto});
        await TokenService.saveToken(user._id, tokens.refreshToken);

        return {tokens, user: userDto}
    }

    async getUsers() {
        const users = await User.find();
        return users;
    }
}
