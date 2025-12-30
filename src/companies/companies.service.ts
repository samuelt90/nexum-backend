import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import * as bcrypt from 'bcrypt';
import { Candidate } from 'src/candidates/candidate.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,

  ) {}

  async create(data: { name: string; slug: string; email: string; password: string }) {
    const { name, slug, email, password } = data;

    const exists = await this.companyRepo.findOne({ where: [{ email }, { slug }] });
    if (exists) throw new BadRequestException('Email o slug ya existe');

    const password_hash = await bcrypt.hash(password, 10);

    const company = this.companyRepo.create({
      name,
      slug,
      email,
      password_hash,
      is_active: true,
    });

    const saved = await this.companyRepo.save(company);

    // para no devolver el hash
    const { password_hash: _, ...safe } = saved as any;
    return safe;
  }
  async listCandidatesBySlug(slug: string) {
    const company = await this.companyRepo.findOne({ where: { slug } });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.candidateRepo.find({
      where: { company: { id: company.id } },
      order: { created_at: 'DESC' as any },
    });
  }

}
