const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createStore } = require('./store.cjs');

function withStore(seed, callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'retail-store-'));
  const file = path.join(directory, 'runtime-data.json');

  try {
    callback(createStore({ file, seed }));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test('store persists mutations and restores missing seed fields', () => {
  const seed = {
    orders: [{ id: 'ORDER-1', status: 'review', timeline: ['created'] }],
    products: [{ id: 'PRODUCT-1', stock: 12, alert: 8 }],
    campaigns: [{ id: 'CAMPAIGN-1', status: 'scheduled', channel: 'mini-app' }],
    stats: [{ label: 'revenue', value: '0' }]
  };

  withStore(seed, (store) => {
    store.saveData({
      orders: [{ id: 'ORDER-1', status: 'shipping' }],
      products: [{ id: 'PRODUCT-1', stock: 36 }],
      campaigns: [{ id: 'CAMPAIGN-1', status: 'running' }]
    });

    const loaded = store.loadData();
    assert.deepEqual(loaded.orders[0], { id: 'ORDER-1', status: 'shipping', timeline: ['created'] });
    assert.deepEqual(loaded.products[0], { id: 'PRODUCT-1', stock: 36, alert: 8 });
    assert.deepEqual(loaded.campaigns[0], { id: 'CAMPAIGN-1', status: 'running', channel: 'mini-app' });
    assert.deepEqual(loaded.stats, seed.stats);
  });
});

test('store assigns stable IDs to legacy campaigns without an ID', () => {
  const seed = { orders: [], products: [], campaigns: [], stats: [] };

  withStore(seed, (store) => {
    store.saveData({
      orders: [],
      products: [],
      campaigns: [{ title: 'Legacy campaign', status: 'scheduled' }]
    });

    const [campaign] = store.loadData().campaigns;
    assert.equal(campaign.id, 'legacy-id-1');
    assert.equal(campaign.title, 'Legacy campaign');
  });
});