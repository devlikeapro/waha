import { MultipartMiddleware } from './MultipartMiddleware';
// We don't import multer to mock it, we let jest handle it.

// Mock multer
jest.mock('multer', () => {
    const multerMiddleware = jest.fn((req, res, next) => next());
    const fields = jest.fn(() => multerMiddleware);
    const m = jest.fn(() => ({
        fields,
    }));
    return m;
});

describe('MultipartMiddleware', () => {
  let middleware: MultipartMiddleware;

  beforeEach(() => {
    middleware = new MultipartMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call multer middleware', () => {
      const req = {} as any;
      const res = {} as any;
      const next = jest.fn();

      middleware.use(req, res, next);
      expect(next).toHaveBeenCalled();
  });
});
