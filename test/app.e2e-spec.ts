import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
// Importar el módulo a ser mockeado
import { ContactService } from '../src/contact/contact.service';
import { PrismaClient } from '@prisma/client';


// Mockear el módulo
jest.mock('./contact.service');
jest.mock('@prisma/client'); // Mockear el módulo PrismaClient


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
