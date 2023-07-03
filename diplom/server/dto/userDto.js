export default class UserDto {

    constructor(user, group) {
        this.name = user.name;
        this.surname = user.surname;
        this.group = group.name;
        this.id = user._id;
    }
}