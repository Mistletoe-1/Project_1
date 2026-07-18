const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const runtimeFile = path.join(__dirname, '.runtime-data.json');
const port = 3107;
const baseUrl = `http://127.0.0.1:${port}`;

function startApi() {
  return spawn(process.execPath, ['server/index.cjs'], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  });
}

async function waitForApi() {
  let lastError;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw lastError || new Error('API did not start');
}

async function stopApi(child) {
  if (!child || child.exitCode !== null) return;

  child.kill();
  await new Promise((resolve) => child.once('exit', resolve));
}

test('campaign status persists after an API restart', async () => {
  const originalRuntime = fs.existsSync(runtimeFile) ? fs.readFileSync(runtimeFile) : null;
  let api;

  try {
    api = startApi();
    await waitForApi();

    const createResponse = await fetch(`${baseUrl}/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Integration campaign' })
    });
    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();

    const updateResponse = await fetch(`${baseUrl}/api/campaigns/${created.id}`, { method: 'PATCH' });
    assert.equal(updateResponse.status, 200);
    const updated = await updateResponse.json();
    assert.notEqual(updated.status, created.status);

    await stopApi(api);
    api = startApi();
    await waitForApi();

    const bootstrapResponse = await fetch(`${baseUrl}/api/bootstrap`);
    const bootstrap = await bootstrapResponse.json();
    const restored = bootstrap.campaigns.find((campaign) => campaign.id === created.id);
    assert.equal(restored.status, updated.status);
  } finally {
    await stopApi(api);

    if (originalRuntime) {
      fs.writeFileSync(runtimeFile, originalRuntime);
    } else if (fs.existsSync(runtimeFile)) {
      fs.rmSync(runtimeFile);
    }
  }
});