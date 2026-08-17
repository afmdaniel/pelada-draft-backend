import 'dotenv/config';
export const mailConfig = {
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
  },
  passwordReset: {
    tokenExpiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN || '30m',
  },
};
