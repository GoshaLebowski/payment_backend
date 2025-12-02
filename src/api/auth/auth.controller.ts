import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'

@Controller('auth')
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @Post('register')
    public async register(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: RegisterDto
    ) {
        return await this.authService.register(res, dto)
    }

    @Post('login')
    public async login(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: LoginDto
    ) {
        return await this.authService.login(res, dto)
    }

    @Post('refresh')
    public async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return await this.authService.refresh(req, res)
    }

    @Post('logout')
    public async logout(@Res({ passthrough: true }) res: Response) {
        return await this.authService.logout(res)
    }
}
