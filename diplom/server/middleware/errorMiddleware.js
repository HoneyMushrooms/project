import ApiError from "../exception/apiError.js";

export default function(e, req, res, next) {
    if(e instanceof ApiError) {
        return res.status(e.status).json({msg: e.message});
    }
    if(e.name === 'CastError') {
        return res.status(400).json({msg: "Некорректный id"});
    }
    if(e.code === 'ENOENT') {
        return res.status(400).json({msg: "Файл не существет"});
    }
    if(e.name === 'InvalidCredentialsError') {
        return res.status(400).json({msg: "не аутентифицирован ldap"});
    }
    if(e.code === 'ENOTFOUND') {
        return res.status(400).json({msg: "нет подключения к ldap"});
    }
    console.log(e)
    return res.status(500).json({msg: 'Непредвиденная ошибка'})
}