interface IGroup {
    name: string;
}

interface IGroupForKeyboard {
    text: string;
    callback_data: string;
}

interface ILesson {
    number: number;
    group_name: string;
    lesson_name: string;
    lesson_type: string;
    room_name: string;
    date: string;
} 

export { IGroup, IGroupForKeyboard, ILesson };