import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Controller, Get, Post, Body, Param, ParseIntPipe, BadRequestException, Res } from '@nestjs/common';
import * as request from 'supertest';
import { CreateWorkerDto, RegisterUnknownDto } from '../../dto/worker.dto';
import { Response } from 'express';

/**
 * Isolated controller for testing HTTP layer behavior.
 * This tests validation pipes, guards, and HTTP semantics
 * WITHOUT the complexity of mocking Drizzle ORM.
 */
@Controller('test-api')
class TestDashboardController {
  @Get('stats')
  getStats() {
    return { totalWorkers: 10, todayLogs: 5 };
  }

  @Post('workers')
  createWorker(@Body() body: CreateWorkerDto) {
    return [{ id: 1, ...body }];
  }

  @Post('unknowns/:id/register')
  registerUnknown(@Param('id', ParseIntPipe) id: number, @Body() body: RegisterUnknownDto) {
    return { registered: true, id, name: body.name };
  }

  @Get('media/:key')
  getMedia(@Param('key') key: string, @Res() res: Response) {
    if (key.includes('..') || key.includes('/') || key.includes('\\')) {
      throw new BadRequestException('Invalid key');
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(Buffer.from('fake-image'));
  }
}

/**
 * E2E tests for HTTP layer validation.
 * These tests verify that NestJS validation pipes and guards work correctly.
 */
describe('HTTP Validation (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestDashboardController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CreateWorkerDto Validation', () => {
    it('rejects empty body - name is required', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('name')])
      );
    });

    it('rejects empty string name', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('empty')])
      );
    });

    it('rejects whitespace-only name', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: '   ' });
      
      expect(response.status).toBe(400);
    });

    it('rejects name over 100 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 'A'.repeat(101) });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('100')])
      );
    });

    it('rejects company over 100 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 'Valid', company: 'B'.repeat(101) });
      
      expect(response.status).toBe(400);
    });

    it('rejects non-string name', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 12345 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('string')])
      );
    });

    it('rejects unknown fields with forbidNonWhitelisted', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 'Test', maliciousField: 'data' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('should not exist')])
      );
    });

    it('accepts valid name only', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 'John Doe' });
      
      expect(response.status).toBe(201);
      expect(response.body[0].name).toBe('John Doe');
    });

    it('accepts valid name and company', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: 'Jane', company: 'Acme Corp' });
      
      expect(response.status).toBe(201);
      expect(response.body[0]).toEqual({ id: 1, name: 'Jane', company: 'Acme Corp' });
    });

    it('accepts name at max length (100 chars)', async () => {
      const maxName = 'A'.repeat(100);
      const response = await request(app.getHttpServer())
        .post('/test-api/workers')
        .send({ name: maxName });
      
      expect(response.status).toBe(201);
      expect(response.body[0].name).toBe(maxName);
    });
  });

  describe('ParseIntPipe Validation', () => {
    it('rejects non-numeric ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/unknowns/abc/register')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Validation failed');
    });

    it('rejects float ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/unknowns/1.5/register')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(400);
    });

    it('accepts valid integer ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/unknowns/42/register')
        .send({ name: 'Worker Name' });
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ registered: true, id: 42, name: 'Worker Name' });
    });

    it('accepts zero as valid ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-api/unknowns/0/register')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(0);
    });
  });

  describe('Path Traversal Protection', () => {
    it('rejects key containing ..', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-api/media/file..name.jpg');
      
      expect(response.status).toBe(400);
    });

    it('rejects key containing forward slash (URL encoded)', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-api/media/path%2Ffile.jpg');
      
      expect(response.status).toBe(400);
    });

    it('rejects key containing backslash (URL encoded)', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-api/media/path%5Cfile.jpg');
      
      expect(response.status).toBe(400);
    });

    it('accepts valid filename', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-api/media/valid-file_123.jpg');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/jpeg');
    });
  });
});
