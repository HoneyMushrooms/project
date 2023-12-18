import TelegramBot, { KeyboardButton, Message } from "node-telegram-bot-api";
import dotenv from 'dotenv';
import db from './db.js';
import TimeTable from "./utils/timeTable.js";
import WorkDate from "./utils/workDate.js";
import { QueryResult } from 'pg';
import { IGroup, IGroupForKeyboard } from "./types/interfaces.js";

dotenv.config();

enum KeyboardButtons {
	Today = '📗 Сегодня',
	Tomorrow = '📘 Завтра',
	Week = '📚 Неделя',
	NextWeek = '🗿 Следущая неделя'
};

let bot: TelegramBot;
const users = new Map<number, string>();

if(process.env.TOKEN) {
	bot = new TelegramBot(process.env.TOKEN, { polling: true });

	bot.onText(/\/start$/, async (msg) => {
		const groupsData: QueryResult<IGroup> = await db.query('SELECT group_name as name FROM public.group');
		const groups = groupsData.rows
			.map((group): IGroupForKeyboard => ({ text: group.name, callback_data: group.name }))
			.reduce((arr: IGroupForKeyboard[][], group: IGroupForKeyboard, index: number) => {
				const groupIndex = Math.floor(index / 4);
				if (!arr[groupIndex]) {
					arr[groupIndex] = [];
				}
				arr[groupIndex].push(group); 
				return arr;
			}, []);

		const startText = `Для начала предлагаю вам выбрать нацию, (я выбрал <i>РИМЛЯН</i>, у них бонус к сбору ресурсов и бонус к атаке 🦍)`

		bot.sendMessage(msg.chat.id, startText, {
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: [
					...groups
				]
			}
		});
	});

	bot.on('callback_query', (msg) => {
		const { id } = msg.from;

		if(msg.data) {
			users.set(id, msg.data);
			
			return bot.sendPhoto(id, './public/ladno.jpg', {
				caption: 'теперь ты можешь смотреть четкое расписание от Максончика, не забудь стрельнуть у него сижку при встрече',
				reply_markup: {
					keyboard: [
						[KeyboardButtons.Today, KeyboardButtons.Tomorrow, KeyboardButtons.Week],
						[KeyboardButtons.NextWeek],
					] as unknown as KeyboardButton[][],
					resize_keyboard: true
				}
			});
		}
	});

	bot.on('text', async (msg) => {

		let id = msg.from?.id;
		
		if(id) {
			const group = users.get(id);
			if(group) {
				switch (msg.text) {
					case KeyboardButtons.Today: {
						const date = WorkDate.formattedDate(new Date());
						
						if(WorkDate.checkFreeDay(date)) {
							bot.sendVideo(id, './public/gachi.mp4', {
								caption: 'друже, сегодня выходной 🍻',
								width: 640,
								height: 480
							})
						} else {
							const timeTable = await TimeTable.day(date, group);
							bot.sendMessage(id, 'Расписание на сегодня ' + timeTable);
						}
						break;
					}
					case KeyboardButtons.Tomorrow: {
						const date = WorkDate.formattedDate(new Date((msg.date + 86400) * 1000));
		
						if(WorkDate.checkFreeDay(date)) {
							bot.sendVideo(id, './gachi.mp4', {
								caption: 'друже, завтра выходной 🍻',
								width: 640,
								height: 480
							})
						} else {
							const timeTable = await TimeTable.day(date, group);
							bot.sendMessage(id, 'Расписание на завтра ' + timeTable);
						}
						break;
					}
					case KeyboardButtons.Week: {
						const dates = WorkDate.getModayAndFriday();
						const timeTable = await TimeTable.week(...dates, group);
						bot.sendMessage(id, 'Расписание на текущую неделю ' + timeTable);
						break;
					}
					case KeyboardButtons.NextWeek: {
						const dates = WorkDate.getModayAndFriday(new Date((msg.date + 86400 * 7) * 1000));
						const timeTable = await TimeTable.week(...dates, group);
						bot.sendMessage(id, 'Расписание на следущую неделю ' + timeTable);
						break;
					}
				}
			}
		}
	});
}
