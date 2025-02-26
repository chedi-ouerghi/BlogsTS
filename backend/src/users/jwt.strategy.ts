import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';  
import { PrismaService } from '../prisma/prisma.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {  
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: 'SECRET_KEY12325555555',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    console.log('Payload from JWT:', payload); 
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }, 
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user; 
  }


}
