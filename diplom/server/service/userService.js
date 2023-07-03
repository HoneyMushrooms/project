import LdapService from "./ldapService.js";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import UserDto from "../dto/userDto.js";
import TokenService from "./tokenService.js";
import ApiError from "../exception/apiError.js";
import GroupService from "./groupService.js";

async function UserAndTokenData(user, groupData) {
    const userDto = new UserDto(user, groupData);     
    const tokens = TokenService.generationTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {user: userDto, tokens}
}

export default new class UserService {
    
    async registration(name, surname, cardId, password, group) {
        const candidate = await User.findOne({cardId});
        if(candidate) {
            throw ApiError.BadRequest(`Пользователь уже существует`);
        }
        
        await LdapService.findUser(cardId, password);
            
        const hashPassword = bcrypt.hashSync(password, +process.env.SALT);
        const groupData = await GroupService.findGroup(group);
        const user = await User.create({
            name,
            surname,
            cardId,
            password: hashPassword,
            group: groupData._id,
        });

        const responseData = UserAndTokenData(user, groupData);

        return responseData;
    }

    async login(cardId, password) {
        const user = await User.findOne({cardId});
        if(!user) {
            throw ApiError.BadRequest(`Пользователь с таким id ${cardId} не зарегистрирован`)
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            throw ApiError.BadRequest("Введен неверный пароль");
        }

        const groupData = await GroupService.findGroupById(user.group);
        
        const responseData = UserAndTokenData(user, groupData);

        return responseData;
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenData = TokenService.findToken(refreshToken);
        if(!userData || !tokenData) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.id);
        const groupData = await GroupService.findGroupById(user.group);
        
        const responseData = UserAndTokenData(user, groupData);

        return responseData;
    }

    async getContacts(id, group) {
        const groupData = await GroupService.findGroup(group);
        const users = await User.find({ _id: { $ne: id }, group: groupData._id}).select([
            "name",
            "surname",
            "_id",
        ]);

        return [groupData, ...users];
    }

    async updateUser(id, name, surname) {
        const user = await User.findById(id);
        if(!user) {
            throw ApiError.BadRequest(`Пользователь не существует`);
        }
        if(!name && !surname || (user.name === name && user.surname === surname)) {
            throw ApiError.BadRequest('Отсуствуют данные на обновление');
        }
        if(name) {
            user.name = name;
        }
        if(surname) {
            user.surname = surname;
        }    
        await user.save(); 
    }
}