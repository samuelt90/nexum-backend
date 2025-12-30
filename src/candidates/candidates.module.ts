import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { CompanyCandidatesController } from './company-candidates.controller';
import { Company } from '../companies/company.entity';
import { EmailOutbox } from 'src/email-outbox/email-outbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Company, EmailOutbox])],
  controllers: [CandidatesController, CompanyCandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}