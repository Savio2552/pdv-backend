export class CreateCompanyDto {
  name: string;
  cnpj: string;
  plan: 'basic' | 'standard' | 'premium';
  monthlyFee: number;
  status?: 'active' | 'inactive' | 'suspended';
  maxUsers?: number;
  maxDevices?: number;
}
