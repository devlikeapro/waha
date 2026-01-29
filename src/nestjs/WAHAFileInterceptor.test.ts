import { CallHandler } from '@nestjs/common';
import { WAHAFileInterceptor } from './WAHAFileInterceptor';
import { of } from 'rxjs';

describe('WAHAFileInterceptor', () => {
  let interceptor: any;
  let context: any;
  let next: CallHandler;

  beforeEach(async () => {
    const InterceptorClass = WAHAFileInterceptor();
    interceptor = new InterceptorClass();

    // Mock the internal fileFieldsInterceptor
    interceptor.fileFieldsInterceptor = {
        intercept: jest.fn().mockImplementation((ctx, nxt) => {
            // Simulate parent interceptor calling handle
            return nxt.handle();
        })
    };

    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
            'content-type': 'multipart/form-data; boundary=something'
        },
        files: {
            file: [{
                mimetype: 'image/png',
                originalname: 'test.png',
                buffer: Buffer.from('test')
            }]
        },
        body: {}
      }),
    };

    next = {
      handle: jest.fn().mockReturnValue(of('test')),
    };
  });

  it('should transform file to body', async () => {
    const observable = await interceptor.intercept(context, next);
    observable.subscribe();

    const req = context.switchToHttp().getRequest();
    expect(req.body.file).toBeDefined();
    expect(req.body.file.mimetype).toBe('image/png');
    expect(req.body.file.filename).toBe('test.png');
    expect(req.body.file.data).toBe(Buffer.from('test').toString('base64'));
  });

  it('should handle "files" field', async () => {
      const req = context.switchToHttp().getRequest();
      req.files = {
          files: [{
                mimetype: 'image/jpeg',
                originalname: 'test.jpg',
                buffer: Buffer.from('test2')
          }]
      };

    const observable = await interceptor.intercept(context, next);
    observable.subscribe();

    expect(req.body.file).toBeDefined();
    expect(req.body.file.mimetype).toBe('image/jpeg');
    expect(req.body.file.filename).toBe('test.jpg');
    expect(req.body.file.data).toBe(Buffer.from('test2').toString('base64'));
  });
});
