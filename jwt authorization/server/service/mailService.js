import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

// if u use gmail
// Step1: Open this link https://myaccount.google.com/security
// Step2: Enable 2 factor authentication
// Click on App passwords just below the 2 factor authentication
// From Select App options select Other and write your app name it could be any name like mycustomapp
// It will generate you the password copy the password from the popup and use the following code.
// Use that copied password in the Auth password section my password was this rkancqhzgvmzsdaqyx

export default new class MailService {
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
              user: process.env.SMTP_USER, 
              pass: process.env.SMTP_PASSWORD, 
            },
        });
    }
    
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Aктивация аккаунта на' + process.env.API_URL,
            text: '',
            html:
                `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
}