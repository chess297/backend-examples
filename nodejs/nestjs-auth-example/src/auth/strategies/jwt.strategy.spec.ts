import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user/user.service';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, AuthService, JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('pass', () => {
    expect(strategy.validate({ username: 'chess', id: 1 })).toEqual({
      userId: 1,
      username: 'chess',
    });
  });

  it('not pass ', () => {
    expect(() => strategy.validate({ username: 'test', id: 1 })).toThrow(
      UnauthorizedException,
    );
  });
});
