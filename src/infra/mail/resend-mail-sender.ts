import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import {
  MailSender,
  PasswordResetEmailData,
} from '../../core/domain/services/mail-sender';
import { mailConfig } from '../config/mail';

@Injectable()
export class ResendMailSender implements MailSender {
  private readonly logger = new Logger(ResendMailSender.name);
  private readonly resend = new Resend(mailConfig.resend.apiKey);

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    try {
      const { error } = await this.resend.emails.send({
        from: mailConfig.resend.fromEmail!,
        to: data.to,
        subject: 'Redefinição de senha - Pelada Draft',
        html: `
          <p>Você solicitou a redefinição da sua senha.</p>
          <p><a href="${data.resetUrl}">Clique aqui para redefinir sua senha</a></p>
          <p>Este link expira em ${data.expiresInMinutes} minutos.</p>
          <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        `,
      });

      if (error) {
        this.logger.error(
          `Falha ao enviar e-mail de redefinição de senha para ${data.to}: ${error.message}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Falha ao enviar e-mail de redefinição de senha para ${data.to}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
