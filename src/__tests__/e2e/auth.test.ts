import axios from 'axios';
import WebSocket = require('ws');

const VALID_API_KEY = '666';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = '666';
const VALID_SESSION_API_KEY = 'key_0fQfI3n3rFVsczBbBfknLXKUreY2my6J';

const BASE_URL = (process.env.WAHA_BASE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);
const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws');

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_UNPROCESSABLE = 422;
const WS_POLICY_VIOLATION = 1008;
const WS_OK_CODES = [1000, 1005];

// Skip all tests if WAHA server is not running
const serverAvailable = async (): Promise<boolean> => {
  try {
    await axios.get(`${BASE_URL}/ping`, { timeout: 1000, validateStatus: () => true });
    return true;
  } catch {
    return false;
  }
};

let skipTests = true;

beforeAll(async () => {
  skipTests = !(await serverAvailable());
  if (skipTests) {
    console.warn('WAHA server not available, skipping auth e2e tests. Start server to run these tests.');
  }
});

const itIfServer = (name: string, fn: () => Promise<void>) => {
  it(name, async () => {
    if (skipTests) {
      return; // Skip silently
    }
    await fn();
  });
};

describe('admin - GET /api/sessions/{name}', () => {
  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/default`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('valid api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/default`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('invalid api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/default`, {
      headers: { 'X-Api-Key': '123' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });
});

describe('admin - POST /api/sessions', () => {
  itIfServer('admin key can create a session without name and remove it', async () => {
    const createResponse = await axios.post(
      `${BASE_URL}/api/sessions`,
      {},
      {
        headers: { 'X-Api-Key': VALID_API_KEY },
        validateStatus: () => true,
      },
    );
    expect(createResponse.status).toBe(HTTP_CREATED);
    expect(createResponse.data?.name).toBeTruthy();

    const deleteResponse = await axios.delete(
      `${BASE_URL}/api/sessions/${createResponse.data.name}`,
      {
        headers: { 'X-Api-Key': VALID_API_KEY },
        validateStatus: () => true,
      },
    );
    expect(deleteResponse.status).toBe(HTTP_OK);
  });
});

describe('GET /api/sessions?all=true', () => {
  beforeAll(async () => {
    if (skipTests) return;
    const createResponse = await axios.post(
      `${BASE_URL}/api/sessions`,
      { name: 'another' },
      {
        headers: { 'X-Api-Key': VALID_API_KEY },
        validateStatus: () => true,
      },
    );
    if (![HTTP_CREATED, HTTP_UNPROCESSABLE].includes(createResponse.status)) {
      throw new Error(
        `Unexpected status for creating "another" session: ${createResponse.status}`,
      );
    }
  });

  afterAll(async () => {
    if (skipTests) return;
    const deleteResponse = await axios.delete(
      `${BASE_URL}/api/sessions/another`,
      {
        headers: { 'X-Api-Key': VALID_API_KEY },
        validateStatus: () => true,
      },
    );
    if (![HTTP_OK, HTTP_NOT_FOUND].includes(deleteResponse.status)) {
      throw new Error(
        `Unexpected status for deleting "another" session: ${deleteResponse.status}`,
      );
    }
  });

  itIfServer('admin key returns two sessions', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions?all=true`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
    expect(response.data).toHaveLength(2);
    expect(response.data.map((session) => session.name).sort()).toEqual([
      'another',
      'default',
    ]);
  });

  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions?all=true`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('session key returns one session', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions?all=true`, {
      headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
    expect(response.data).toHaveLength(1);
    expect(response.data[0]?.name).toBe('default');
  });
});

describe('GET /api/server/version', () => {
  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/version`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('admin api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/version`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('session api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/version`, {
      headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });
});

describe('GET /api/server/environment', () => {
  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/environment`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('admin api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/environment`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('session api key is forbidden', async () => {
    const response = await axios.get(`${BASE_URL}/api/server/environment`, {
      headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_FORBIDDEN);
  });
});

describe('admin - GET /health', () => {
  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/health`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('valid api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/health`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('invalid api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/health`, {
      headers: { 'X-Api-Key': '123' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });
});

describe('/ws', () => {
  const buildWsUrl = (apiKey?: string) => {
    const wsUrl = new URL('/ws', WS_BASE_URL);
    wsUrl.searchParams.set('session', '*');
    wsUrl.searchParams.set('events', '*');
    if (apiKey) {
      wsUrl.searchParams.set('x-api-key', apiKey);
    }
    return wsUrl.toString();
  };

  const waitForOpen = (socket: WebSocket, timeoutMs = 5_000) =>
    new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket open timeout'));
      }, timeoutMs);
      socket.once('open', () => {
        clearTimeout(timeout);
        resolve();
      });
      socket.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

  const waitForClose = (socket: WebSocket, timeoutMs = 5_000) =>
    new Promise<{ code: number; reason: string }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket close timeout'));
      }, timeoutMs);
      socket.once('close', (code, reason) => {
        clearTimeout(timeout);
        resolve({ code, reason: reason.toString() });
      });
      socket.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

  itIfServer('no api key is unauthorized', async () => {
    const socket = new WebSocket(buildWsUrl());
    const { code } = await waitForClose(socket);
    expect(code).toBe(WS_POLICY_VIOLATION);
  });

  itIfServer('admin api key is ok', async () => {
    const socket = new WebSocket(buildWsUrl(VALID_API_KEY));
    await waitForOpen(socket);
    socket.close();
    const { code } = await waitForClose(socket);
    expect(WS_OK_CODES).toContain(code);
  });
});

describe('GET /api/files/test.txt', () => {
  // create "test.txt" in current dir/.media/test.txt
  let file = null;
  beforeAll(() => {
    const fs = require('fs');
    const path = require('path');
    const mediaDir = path.resolve('./.media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir);
    }
    const filePath = path.join(mediaDir, 'test.txt');
    fs.writeFileSync(filePath, 'This is a test file.');
    file = filePath;
  });
  itIfServer('no api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/files/test.txt`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('valid api key is ok', async () => {
    const response = await axios.get(`${BASE_URL}/api/files/test.txt`, {
      headers: { 'X-Api-Key': VALID_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('invalid api key is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/files/test.txt`, {
      headers: { 'X-Api-Key': '123' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });
});

describe('GET /', () => {
  itIfServer('no auth is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('valid auth is ok', async () => {
    const response = await axios.get(`${BASE_URL}/`, {
      auth: { username: VALID_USERNAME, password: VALID_PASSWORD },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('wrong auth is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/`, {
      auth: { username: VALID_USERNAME, password: 'password-another' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });
});

describe('GET /dashboard', () => {
  itIfServer('no auth is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/`, {
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('valid auth is ok', async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/`, {
      auth: { username: VALID_USERNAME, password: VALID_PASSWORD },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('wrong auth is unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/`, {
      auth: { username: VALID_USERNAME, password: 'password-another' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });
});

describe('session key - GET /api/sessions/{name}', () => {
  itIfServer('default key - default session - is authorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/default`, {
      headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_OK);
  });

  itIfServer('default key - create a new sessions - forbidden', async () => {
    const response = await axios.post(
      `${BASE_URL}/api/sessions`,
      { name: 'newone' },
      {
        headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
        validateStatus: () => true,
      },
    );
    expect(response.status).toBe(HTTP_FORBIDDEN);
  });

  itIfServer('another key - default session - unauthorized', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/default`, {
      headers: { 'X-Api-Key': 'key_another' },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_UNAUTHORIZED);
  });

  itIfServer('default key - another session - forbidden', async () => {
    const response = await axios.get(`${BASE_URL}/api/sessions/another`, {
      headers: { 'X-Api-Key': VALID_SESSION_API_KEY },
      validateStatus: () => true,
    });
    expect(response.status).toBe(HTTP_FORBIDDEN);
  });
});
