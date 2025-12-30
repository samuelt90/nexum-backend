import { Body, Controller, Param, Post } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';

@Controller('companies')
export class CompanyCandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post(':slug/candidates')
  createForCompanySlug(
    @Param('slug') slug: string,
    @Body() body: Partial<Candidate>,
  ) {
    return this.candidatesService.createForCompanySlug(slug, body);
  }
}