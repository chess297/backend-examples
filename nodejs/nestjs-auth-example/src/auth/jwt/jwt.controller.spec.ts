import { Test, TestingModule } from '@nestjs/testing';
import { JwtController } from './jwt.controller';
import { AuthModule } from '../auth.module';

describe('JwtController', () => {
  let controller: JwtController;

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
});
