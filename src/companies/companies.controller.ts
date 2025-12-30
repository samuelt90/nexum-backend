import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() body: { name: string; slug: string; email: string; password: string }) {
    return this.companiesService.create(body);
  }

@Get(':slug/candidates')
  async listCandidates(@Param('slug') slug: string) {
    return this.companiesService.listCandidatesBySlug(slug);
  }

}