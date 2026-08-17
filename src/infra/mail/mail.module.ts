import { Module } from '@nestjs/common';
import { MailSender } from '../../core/domain/services/mail-sender';
import { ResendMailSender } from './resend-mail-sender';

@Module({
  providers: [
    {
      provide: MailSender,
      useClass: ResendMailSender,
    },
  ],
  exports: [MailSender],
})
export class MailModule {}
