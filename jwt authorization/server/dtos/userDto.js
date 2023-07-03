export default class UserDto {

    constructor(user, active) {
        this.email = user.email;
        this.id = user._id;
        this.isActivated = active.isActivated;
    }
}