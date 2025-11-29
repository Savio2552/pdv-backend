import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Company } from '../../auth/entities/company.entity';
import { User } from '../../auth/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepo: Repository<Company>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
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

  async createUser(companyId: string, createUserDto: CreateUserDto): Promise<User> {
    const company = await this.findOne(companyId);

    const existingUser = await this.usersRepo.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const currentUsers = await this.usersRepo.count({ where: { companyId } });
    if (currentUsers >= (company.maxUsers || 5)) {
      throw new ConflictException(`Limite de usuários atingido (${company.maxUsers})`);
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
      role: createUserDto.role,
      companyId
    });

    return this.usersRepo.save(user);
  }

  async getCompanyUsers(companyId: string): Promise<User[]> {
    await this.findOne(companyId);
    return this.usersRepo.find({ 
      where: { companyId },
      order: { createdAt: 'DESC' }
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usersRepo.remove(user);
  }
}
