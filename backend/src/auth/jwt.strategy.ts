import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'netflick_secret_2026',
    });
  }

  async validate(payload: { sub: number; username: string; rol: string }) {
    return { id: payload.sub, username: payload.username, rol: payload.rol };
  }
}