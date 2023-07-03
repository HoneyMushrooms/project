import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import db from './db.js';
import TimeTable from "./utils/timeTable.js";
import WorkDate from "./utils/workDate.js";

dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const users = new Map();

bot.onText(/\/start$/, async (msg) => {

	// да, этот запрос вынести бы отсюда похорошему, ну ладно
	const groupsData = await db.query('SELECT group_name as gn FROM public.group');
	const groups = groupsData.rows.map( group => ({ text: group.gn, callback_data: group.gn })).reduce((acc, cur, i) => {
		const groupIndex = Math.floor(i / 4);
		if (!acc[groupIndex]) {
		  acc[groupIndex] = [];
		}
		acc[groupIndex].push(cur); 
		return acc;
	}, []);

	const startText = `Для начала предлагаю вам выбрать нацию, (я выбрал <i>РИМЛЯН</i>, у них бонус к сбору ресурсов и бонус к атаке 🦍)`

	bot.sendMessage(msg.chat.id, startText, {
		parse_mode: 'HTML',
		reply_markup: {
			inline_keyboard: [
				...groups
			]
		}
	})
})

bot.on('callback_query', (msg) => {
	const { id } = msg.from;

	users.set(id, msg.data);
	
	return bot.sendPhoto(id, './public/ladno.jpg', {
		caption: 'теперь ты можешь смотреть четкое расписание от Максончика, не забудь стрельнуть у него сижку при встрече',
		reply_markup: {
			keyboard: [
				['📗 Сегодня', '📘 Завтра', '📚 Неделя'],
				['🗿 Следущая неделя'],
			],
			resize_keyboard: true
		}
	});
})

bot.on('message', async (msg) => {
	console.log('msg :>> ', msg);
	const { id } = msg.from;
	const group = users.get(id);
	
	switch (msg.text) {
		case '📗 Сегодня': {
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
		case '📘 Завтра': {
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
		case '📚 Неделя': {
			const dates = WorkDate.getModayAndFriday();
			const timeTable = await TimeTable.week(...dates, group);
			bot.sendMessage(id, 'Расписание на текущую неделю ' + timeTable);
			break;
		}
		case '🗿 Следущая неделя': {
			const dates = WorkDate.getModayAndFriday(new Date((msg.date + 86400 * 7) * 1000));
			const timeTable = await TimeTable.week(...dates, group);
			bot.sendMessage(id, 'Расписание на следущую неделю ' + timeTable);
			break;
		}
	}
})
