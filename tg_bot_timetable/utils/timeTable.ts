import db from '../db.js';
import workDate from './workDate.js';
import { QueryResult } from 'pg';
import { ILesson } from '../types/interfaces.js';

const numberSticker = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
const days = ['🐔 Понедельник-день-бездельник', '🦍 Вторник-повторник', '👌 Среда-тамада', '🔇 Четверг-я заботы все отверг', '💘 Пятница-пьяница'];

export default new class TimeTable {

    async day(date: string, group: string): Promise<string> {
        
        const lessonsData: QueryResult<ILesson> = await db.query(
            `SELECT number, group_name, lesson_name, lesson_type, room_name, date 
               FROM timetable
               JOIN public.group gr ON gr.id = timetable.group_id AND gr.group_name = $1
               JOIN public.lesson ls ON ls.id = timetable.lesson_id 
               JOIN public.room rm ON rm.id = timetable.room_id
              WHERE timetable.date = $2
        `, [group, date]);

        if(lessonsData.rows.length == 0) {
            return 'отсустувет';
        }
        const datePgTimeZone = new Date(lessonsData.rows[0].date);
        const dateLocalTime = new Date(datePgTimeZone.getTime() - datePgTimeZone.getTimezoneOffset() * 60000).getTime();
        const formattedDate = workDate.formattedDate(new Date(dateLocalTime));
        
        const lessons = lessonsData.rows.map(lesson => {
            lesson.date = formattedDate;
            return lesson;
        });
        
        const result = this.printTimeTable(lessons);
        return result;
    }
    
    async week(moday: string, friday: string, group: string): Promise<string> {
        
        const lessonsData: QueryResult<ILesson> = await db.query(
            `SELECT number, group_name, lesson_name, lesson_type, date 
               FROM timetable
               JOIN public.group gr ON gr.id = timetable.group_id AND gr.group_name = $1
               JOIN public.lesson ls ON ls.id = timetable.lesson_id 
               JOIN public.room rm ON rm.id = timetable.room_id
              WHERE timetable.date >= $2 AND timetable.date <= $3
        `, [group, moday, friday]);
            
        if(lessonsData.rows.length == 0) {
                return 'отсустувет';
        }
                
        const lessons = lessonsData.rows.map(lesson => {
            const datePgTimeZone = new Date(lesson.date);
            const dateLocalTime = new Date(datePgTimeZone.getTime() - datePgTimeZone.getTimezoneOffset() * 60000).getTime();
            const formattedDate = workDate.formattedDate(new Date(dateLocalTime));
        
            lesson.date = formattedDate;
            return lesson;
        });

        const result = this.printTimeTable(lessons, true);
        return result;
    }

    printTimeTable(lessons: ILesson[], flag: boolean = false): string {
        let result: string;
        if(flag) {
            result = `для группы ${lessons[0].group_name}\n`;
            let date: string = '';
            let count: number = 0;
            lessons.forEach(lesson => {
                if(lesson.date !== date) {
                    result += `\n${days[count]} (${lessons[0].date})\n`;
                    date = lesson.date;
                    count++;
                }
                result += `${numberSticker[lesson.number - 1]} Пара: ${lesson.lesson_name} (${lesson.lesson_type})\n`
            })
        } else {
            result = `(${lessons[0].date}) для группы ${lessons[0].group_name}\n\n`;
            lessons.forEach(lesson => result+= `${numberSticker[lesson.number - 1]} Пара: ${lesson.lesson_name} (${lesson.lesson_type})\nAудитория: ${lesson.room_name}\n\n`);
        }

        return result;
    }
}