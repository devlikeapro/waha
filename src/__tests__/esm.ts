/**
 * Loads an ESM-only package through Node's own loader, bypassing Jest's CommonJS resolver.
 * Use it as a lazy jest.mock factory: jest.mock('file-type', () => requireModule('file-type'), { virtual: true })
 */
export function requireModule(name: string): unknown {
  // @types/node in this repo predates process.getBuiltinModule (Node 22.3+)
  const nodeProcess = process as unknown as {
    getBuiltinModule(id: string): typeof import('module');
  };
  const nodeModule = nodeProcess.getBuiltinModule('module');
  return nodeModule.createRequire(__filename)(name);
}
