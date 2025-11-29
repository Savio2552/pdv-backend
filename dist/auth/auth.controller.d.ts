import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(body: LoginDto, response: Response): Promise<Response<any, Record<string, any>>>;
    refresh(request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
    logout(body: {
        userId: string;
    }, response: Response): Promise<Response<any, Record<string, any>>>;
    createTest(body: {
        email: string;
        password: string;
    }): Promise<import("./entities/user.entity").User>;
}
