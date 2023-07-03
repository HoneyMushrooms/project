// Резкий всплеск ошибок 429 на графике.  
// Это началась DDOS атака, или кто-то из разработчиков выбрал неудачный статус?

export default class ApiError extends Error {
    constructor(status, message) {
        super(message)

        this.status = status;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }
}