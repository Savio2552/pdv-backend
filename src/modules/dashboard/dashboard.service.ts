import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../auth/entities/company.entity';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Company)
    private companiesRepo: Repository<Company>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getStats() {
    const companies = await this.companiesRepo.find();
    const activeCompanies = companies.filter(c => c.status === 'active');
    
    const mrr = activeCompanies.reduce((sum, company) => sum + Number(company.monthlyFee), 0);
    
    const mrrGrowth = 5.2;
    
    const totalUsers = await this.usersRepo.count();
    
    const totalDevices = activeCompanies.reduce((sum, company) => sum + (company.maxDevices || 0), 0);
    
    const activePdvs = totalDevices;
    const pdvsGrowth = -1.5;
    
    const newClientsThisMonth = Math.floor(activeCompanies.length * 0.1);
    const newClientsGrowth = 10;
    
    const companiesGrowth = 2.1;

    return {
      mrr: Math.round(mrr),
      mrrGrowth,
      activeCompanies: activeCompanies.length,
      companiesGrowth,
      activePdvs,
      pdvsGrowth,
      newClients: newClientsThisMonth,
      newClientsGrowth,
      monthlyRevenue: Math.round(mrr * 0.85),
      revenueGrowth: 12.8,
      onlinePdvs: Math.floor(activePdvs * 0.75),
      totalCompanies: companies.length,
      inactiveCompanies: companies.filter(c => c.status === 'inactive').length,
      suspendedCompanies: companies.filter(c => c.status === 'suspended').length,
      totalUsers
    };
  }
}
