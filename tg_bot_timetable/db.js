import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
    user: 'postgres',
    password: '1',
    host: 'localhost',
    port: 5432,
    database: "tg_timetable"
});

export default pool;