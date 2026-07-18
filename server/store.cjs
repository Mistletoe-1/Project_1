const fs = require('node:fs');
const path = require('node:path');
const seedData = require('./data.cjs');

const runtimeFile = path.join(__dirname, '.runtime-data.json');

function createStore({ file = runtimeFile, seed = seedData } = {}) {
  const cloneSeedData = () => JSON.parse(JSON.stringify(seed));

function mergeCollection(seedItems, savedItems, key) {
  if (!Array.isArray(savedItems)) return seedItems;

  return savedItems.map((item, index) => {
    if (!item[key]) {
      return { [key]: `legacy-${key}-${index + 1}`, ...item };
    }

    const seedItem = seedItems.find((seed) => seed[key] === item[key]);
    return seedItem ? { ...seedItem, ...item } : item;
  });
}

  function hydrateData(savedData) {
  const initialData = cloneSeedData();

  return {
    ...initialData,
    ...savedData,
    orders: mergeCollection(initialData.orders, savedData.orders, 'id'),
    products: mergeCollection(initialData.products, savedData.products, 'id'),
    campaigns: mergeCollection(initialData.campaigns, savedData.campaigns, 'id')
  };
}

  function loadData() {
  if (!fs.existsSync(file)) {
    return cloneSeedData();
  }

  try {
    return hydrateData(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch (error) {
    return cloneSeedData();
  }
}

  function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

  return { loadData, saveData };
}

const defaultStore = createStore();

module.exports = {
  ...defaultStore,
  createStore
};
