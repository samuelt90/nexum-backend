import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(@Body() body: Partial<Candidate>) {
    return this.candidatesService.create(body);
  }

  @Get(':id')
async getCandidateById(@Param('id') id: string) {
  return this.candidatesService.findById(Number(id));
}
@Patch(':id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() body: Partial<Candidate>,
  ) {
    return this.candidatesService.update(Number(id), body);
  }
}