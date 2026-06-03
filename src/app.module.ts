import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './core/domain/domain.molude';
import { ApplicationModule } from './core/application/application.module';
import { AuthModule } from './infra/http/auth/auth.module';

@Module({
  imports: [
    DomainModule,
    ApplicationModule,
    HttpModule,
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
