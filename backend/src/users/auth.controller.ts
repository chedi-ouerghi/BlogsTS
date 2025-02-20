import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    const newUser = await this.authService.register(createUserDto);

    console.log('✅ [REGISTER] New user created:');
    console.log(`Username: ${newUser.username}`);
    console.log(`Email: ${newUser.email}`);

    return newUser;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.login(user);

    console.log('✅ [LOGIN] User logged in:');
    console.log(`Username: ${user.username}`);
    console.log(`Token: ${token.access_token}`);

    return token;
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    // console.log('🔍 [PROFILE] Request Headers:', req.headers);
    // console.log('🔍 [PROFILE] Decoded User:', req.user);

    const userProfile = await this.authService.getProfile(req.user._id);

    console.log('✅ [PROFILE] User Profile Retrieved:');
    console.log(`Username: ${userProfile.username}`);
    console.log(`Email: ${userProfile.email}`);

    return userProfile;
  }
}
