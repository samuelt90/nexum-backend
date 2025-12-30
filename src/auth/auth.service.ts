import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async login(email: string, password: string) {
    const company = await this.companyRepo.findOne({
      where: { email, is_active: true },
    });

    if (!company) {
      throw new UnauthorizedException('Empresa no encontrada');
    }

    const isValid = await bcrypt.compare(password, company.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      message: 'Login correcto',
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        email: company.email,
      },
    };
  }
}
