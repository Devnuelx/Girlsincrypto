import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    me(req: any): Promise<{
        user: any;
    }>;
}
