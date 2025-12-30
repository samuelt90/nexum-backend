import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Candidate } from 'src/candidates/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Candidate])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [TypeOrmModule, CompaniesService],
})
export class CompaniesModule {}