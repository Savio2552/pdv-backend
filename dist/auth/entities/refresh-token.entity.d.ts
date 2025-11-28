import { User } from './user.entity';
export declare class RefreshToken {
    id: string;
    token: string;
    user: User;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}
