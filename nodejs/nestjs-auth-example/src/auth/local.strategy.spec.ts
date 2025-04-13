import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user/user.service';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

describe('AuthService', () => {
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

  it('should be defined', async () => {
    // expect( strategy.validate('test', 'test')).c();
  });
});
