import nodemailer from 'nodemailer';
import { config } from '../config';

export const mailerClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
});

export const sendActivationToken = async (to: string, token: string) => {
  const activationLink = `${config.CLIENT_PUBLIC_URL}/activateaccount?email=${to}&token=${token}`;
  // send email
  return mailerClient.sendMail({
    from: config.MAIL_USER,
    to,
    subject: '[PWA-NOTES-APP] Confirm registration',
    html: `<a href="${activationLink}">Click</a> to activate your account.
     Or manually follow this link: ${activationLink}`,
  });
};

export const sendResetPasswordToken = async (to: string, token: string) => {
  const resetLink = `${config.CLIENT_PUBLIC_URL}/resetpasswordfinish?email=${to}&token=${token}`;
  // send email
  return mailerClient.sendMail({
    from: config.MAIL_USER,
    to,
    subject: '[PWA-NOTES-APP] Reset password request',
    html: `<a href="${resetLink}">Click</a> to reset your password. Type this link manually: ${resetLink}`,
  });
};
