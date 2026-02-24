const { LocalStoreCore } = require('./dist/core/storage/LocalStoreCore');
const { LocalSessionConfigRepository } = require('./dist/core/storage/LocalSessionConfigRepository');
const fs = require('fs');
const path = require('path');

async function test() {
  const store = new LocalStoreCore('test-engine');
  await store.init('default');
  const repo = new LocalSessionConfigRepository(store);
  
  await repo.saveConfig('default', { proxy: { server: 'http://test:8080' } });
  const config = await repo.getConfig('default');
  console.log('Saved config:', config);
  
  const content = fs.readFileSync(path.join(store.getSessionDirectory('default'), '.waha.session.config.json'), 'utf-8');
  console.log('File content:', content);
}

test().catch(console.error);
