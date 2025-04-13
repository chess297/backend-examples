import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user/user.service';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, AuthService, LocalStrategy],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('pass', () => {
    expect(strategy.validate('john', 'changeme')).toEqual({
      id: 1,
      username: 'john',
    });
  });

  it('not pass ', () => {
    expect(() => strategy.validate('joe', 'test')).toThrow(
      UnauthorizedException,
    );
  });
});
