import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }



  @Post('register')
  async register(@Body() createUserDto: any) {
    try {
      const newUser = await this.authService.register(createUserDto);

      console.log('✅ [REGISTER] New user created:');
      console.log(`Username: ${newUser.username}`);
      console.log(`Email: ${newUser.email}`);


      return {
        message: 'User successfully registered',
        user: newUser,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new UnauthorizedException('Failed to register user');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      const token = await this.authService.login(user);

      console.log('✅ [LOGIN] User logged in:');
      console.log(`Username: ${user.username}`);
      console.log(`Token: ${token.access_token}`);

      return token;
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    const userId = req.user.id;
    console.log('User ID:', userId);
    try {
      const user = await this.authService.getProfile(userId);
      return user;
    } catch (error) {
      console.error('Error retrieving profile:', error);
      throw new NotFoundException('User profile not found');
    }
  }


}
