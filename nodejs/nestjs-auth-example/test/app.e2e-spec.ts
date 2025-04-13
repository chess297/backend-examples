import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '@/constants';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: App;
  const jwt = new JwtService({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '60s' },
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    // jwt = moduleFixture.get<JwtService>(JwtService);
  });

  it('/ (GET)', () => {
    return request(server).get('/').expect(200).expect('Hello World!');
  });

  it('/local/pass (POST)', () => {
    return request(server)
      .post('/local/pass')
      .send({
        username: 'john',
        password: 'changeme',
      })
      .expect(201);
  });

  it('/local/not-pass (POST)', () => {
    return request(server).post('/local/not-pass').expect(401);
  });

  it('/jwt/pass (POST)', async () => {
    const token = await jwt.signAsync({
      username: 'chess',
      id: 1,
    });
    return request(server)
      .post('/jwt/pass')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });

  it('/jwt/pass other secret (POST)', async () => {
    const jwt = new JwtService({
      secret: 'test',
      signOptions: { expiresIn: '60s' },
    });
    const token = await jwt.signAsync({
      username: 'chess',
      id: 1,
    });

    return request(server)
      .post('/jwt/not-pass')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('/jwt/not-pass not Authorization   (POST)', async () => {
    return request(server).post('/jwt/not-pass').expect(401);
  });
});
