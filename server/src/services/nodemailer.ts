import nodemailer from 'nodemailer';
import { config } from '../config';

export const mailerClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
});
