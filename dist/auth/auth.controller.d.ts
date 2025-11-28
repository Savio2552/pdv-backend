import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refresh(body: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    logout(body: {
        userId: string;
    }): Promise<{
        ok: boolean;
    }>;
    createTest(body: {
        email: string;
        password: string;
    }): Promise<import("./entities/user.entity").User>;
}
