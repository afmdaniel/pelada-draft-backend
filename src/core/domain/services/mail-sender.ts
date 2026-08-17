export interface PasswordResetEmailData {
  to: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export abstract class MailSender {
  abstract sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void>;
}
