import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
export declare class AuthService {
    private usersRepo;
    private rtRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, rtRepo: Repository<RefreshToken>, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User | null>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    refreshToken(userId: string, refreshPlain: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    revokeRefreshTokens(userId: string): Promise<void>;
    createUser(email: string, password: string): Promise<User>;
}
