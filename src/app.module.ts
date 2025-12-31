import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesService } from './candidates/candidates.service';
import { CandidatesModule } from './candidates/candidates.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { EmailOutboxModule } from './email-outbox/email-outbox.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.MYSQLHOST,
        port: Number(process.env.MYSQLPORT),
        username: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
    }),
    CandidatesModule,
    CompaniesModule,
    AuthModule,
    EmailOutboxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
