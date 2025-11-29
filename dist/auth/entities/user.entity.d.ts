import { Company } from './company.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    companyId: string;
    company: Company;
    createdAt: Date;
}
