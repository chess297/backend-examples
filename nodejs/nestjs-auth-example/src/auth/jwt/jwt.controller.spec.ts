import { Test, TestingModule } from '@nestjs/testing';
import { JwtController } from './jwt.controller';
import { AuthModule } from '../auth.module';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '@/constants';

describe('JwtController', () => {
  let controller: JwtController;
  const jwt = new JwtService({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '60s' },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [],
    }).compile();

    controller = module.get<JwtController>(JwtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass', async () => {
    const token = await jwt.signAsync({
      username: 'chess',
      id: 1,
    });
    // const result = await controller.login();
  });
});
