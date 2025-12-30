import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { Company } from '../companies/company.entity';
import { EmailOutbox } from 'src/email-outbox/email-outbox.entity';

@Injectable()
export class CandidatesService {
  constructor(

    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository (EmailOutbox)
    private readonly emailOutboxRepo: Repository<EmailOutbox>,
  ) {}

  async create(data: Partial<Candidate>) {
    const candidate = this.candidateRepo.create(data);
    return await this.candidateRepo.save(candidate);
  }

  async createForCompanySlug(slug: string, data: Partial<Candidate>) {
    const company = await this.companyRepo.findOne({
      where: { slug, is_active: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const candidate = this.candidateRepo.create({
      ...data,
      company: company, // asigna company_id automáticamente via relación
    });


    const saved= await
    this.candidateRepo.save(candidate);
    
    const candidateEmail = (saved as any).correo;
    const companyEmail = (company as any).email;

    if (candidateEmail) {
      await this.emailOutboxRepo.save(
        this.emailOutboxRepo.create({
          company_id: (company as any).id ?? null,
          candidate_id: (saved as any).id ?? null,
          to_email: candidateEmail,
          subject: 'Confirmación de registro - Nexum',
          body_html: `
            <h2>Registro enviado</h2>
            <p>Hola ${(saved as any).nombres ?? ''}, tu registro fue enviado correctamente.</p>
            <p>Empresa: <b>${(company as any).name ?? slug}</b></p>
          `,
          status: 'pending',
          attempts: 0,
          last_error: null,
        }),
      );
    }

    if (companyEmail) {
      await this.emailOutboxRepo.save(
        this.emailOutboxRepo.create({
          company_id: (company as any).id ?? null,
          candidate_id: (saved as any).id ?? null,
          to_email: companyEmail,
           subject: `Nuevo candidato registrado - ${(saved as any).nombres ?? ''} ${(saved as any).apellidos ?? ''}`.trim(),
      body_html: `
        <h2>Nuevo candidato registrado</h2>
        <p>Se ha registrado un nuevo candidato para tu empresa.</p>

        <h3>Ficha digital del candidato</h3>
        <ul>
          <li><b>Nombre:</b> ${(saved as any).nombres ?? ''} ${(saved as any).apellidos ?? ''}</li>
          <li><b>Correo:</b> ${(saved as any).correo ?? ''}</li>
          <li><b>Teléfono:</b> ${(saved as any).telefono ?? ''}</li>
          <li><b>Puesto:</b> ${(saved as any).puesto_aplica ?? ''}</li>
        </ul>
          `,
          status: 'pending',
          attempts: 0,
          last_error: null,
        }),
      );
    }

    return saved;
  
  }

 async findById(id: number) {
  return this.candidateRepo.findOne({
    where: { id },
  });
} 

 async update(id: number, data: Partial<Candidate>) {
  const existing = await this.candidateRepo.findOne({ where: { id } });
  if (!existing) throw new NotFoundException('Candidato no encontrado');

  await this.candidateRepo.update({ id }, data);
  return this.candidateRepo.findOne({ where: { id } });
}

}