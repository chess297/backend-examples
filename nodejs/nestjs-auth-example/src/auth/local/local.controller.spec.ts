import { Test, TestingModule } from '@nestjs/testing';
import { LocalController } from './local.controller';
// import { RequestWithUser } from '@/user/entities/user.entity';
// import { UnauthorizedException } from '@nestjs/common';

describe('LocalController', () => {
  let controller: LocalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalController],
    }).compile();

    controller = module.get<LocalController>(LocalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should be pass', () => {
  //   return expect(
  //     controller.login({
  //       user: { username: 'john', password: 'changeme' },
  //     } as RequestWithUser),
  //   ).toEqual({
  //     username: 'john',
  //     password: 'changeme',
  //   });
  // });

  // it('should be not pass', async () => {
  //   return expect(
  //     controller.login({
  //       user: { username: 'test', password: 'test' },
  //     } as RequestWithUser),
  //   ).rejects.toThrow(UnauthorizedException);
  // });
});
