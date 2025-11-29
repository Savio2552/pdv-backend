import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../auth/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepo: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existingCompany = await this.companiesRepo.findOne({
      where: { cnpj: createCompanyDto.cnpj }
    });

    if (existingCompany) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const company = this.companiesRepo.create({
      ...createCompanyDto,
      status: createCompanyDto.status || 'active'
    });

    return this.companiesRepo.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepo.find({
      relations: ['users'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepo.findOne({
      where: { id },
      relations: ['users']
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCompany = await this.companiesRepo.findOne({
        where: { cnpj: updateCompanyDto.cnpj }
      });

      if (existingCompany) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    Object.assign(company, updateCompanyDto);
    return this.companiesRepo.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepo.remove(company);
  }

  async getStats() {
    const total = await this.companiesRepo.count();
    const active = await this.companiesRepo.count({ where: { status: 'active' } });
    const inactive = await this.companiesRepo.count({ where: { status: 'inactive' } });
    const suspended = await this.companiesRepo.count({ where: { status: 'suspended' } });

    const companies = await this.companiesRepo.find({ where: { status: 'active' } });
    const totalRevenue = companies.reduce((sum, company) => sum + company.monthlyFee, 0);

    return {
      total,
      active,
      inactive,
      suspended,
      totalRevenue,
      mrr: totalRevenue
    };
  }
}
