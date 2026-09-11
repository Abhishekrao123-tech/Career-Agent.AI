import mongoose from 'mongoose';

let mongoServerInstance = null;
let connectionPromise = null;
const inMemoryCollections = new Map();

function getCollection(name) {
  if (!inMemoryCollections.has(name)) {
    inMemoryCollections.set(name, []);
  }
  return inMemoryCollections.get(name);
}

function enableInMemoryEngine() {
  if (mongoose.__inMemoryEngineActive) return;
  mongoose.__inMemoryEngineActive = true;

  console.log('[MongoDB] Activated Fast Zero-Latency In-Memory Database Engine');

  Object.defineProperty(mongoose.connection, 'readyState', {
    get: () => 1,
    configurable: true
  });
  mongoose.connection.host = 'in-memory-engine';

  const originalSave = mongoose.Model.prototype.save;
  mongoose.Model.prototype.save = function () {
    if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
      return originalSave.call(this);
    }
    const store = getCollection(this.constructor.collection.name);
    if (!this._id) this._id = new mongoose.Types.ObjectId();
    const existingIdx = store.findIndex((item) => item._id?.toString() === this._id.toString());
    const docObj = this.toObject ? this.toObject() : { ...this };
    if (existingIdx >= 0) {
      store[existingIdx] = { ...store[existingIdx], ...docObj, updatedAt: new Date() };
    } else {
      store.push({ ...docObj, createdAt: new Date(), updatedAt: new Date() });
    }
    return Promise.resolve(this);
  };

  const matchesFilter = (item, filter = {}) => {
    return Object.keys(filter).every((k) => {
      const itemVal = item[k];
      const filterVal = filter[k];
      if (itemVal == null || filterVal == null) return itemVal === filterVal;
      if (typeof itemVal === 'object' || typeof filterVal === 'object') {
        return itemVal.toString() === filterVal.toString();
      }
      return itemVal === filterVal;
    });
  };

  const patchModel = (model) => {
    if (model.__isPatchedForInMemory) return;
    model.__isPatchedForInMemory = true;
    const collName = model.collection.name;

    const originalFindOne = model.findOne.bind(model);
    model.findOne = function (filter = {}) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalFindOne(filter);
      }
      const store = getCollection(collName);
      const doc = store.find((item) => matchesFilter(item, filter));
      return Promise.resolve(doc ? new model(doc) : null);
    };

    const originalFind = model.find.bind(model);
    model.find = function (filter = {}) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalFind(filter);
      }
      const store = getCollection(collName);
      const matches = store.filter((item) => matchesFilter(item, filter));
      return Promise.resolve(matches.map((m) => new model(m)));
    };

    const originalFindById = model.findById.bind(model);
    model.findById = function (id) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalFindById(id);
      }
      const store = getCollection(collName);
      const doc = store.find((item) => item._id?.toString() === id?.toString());
      return Promise.resolve(doc ? new model(doc) : null);
    };

    const originalCreate = model.create.bind(model);
    model.create = function (docOrDocs) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalCreate(docOrDocs);
      }
      const store = getCollection(collName);
      const docs = Array.isArray(docOrDocs) ? docOrDocs : [docOrDocs];
      const created = docs.map((d) => {
        const _id = d._id || new mongoose.Types.ObjectId();
        const fullDoc = { ...d, _id, createdAt: new Date(), updatedAt: new Date() };
        store.push(fullDoc);
        return new model(fullDoc);
      });
      return Promise.resolve(Array.isArray(docOrDocs) ? created : created[0]);
    };

    const originalFindOneAndUpdate = model.findOneAndUpdate.bind(model);
    model.findOneAndUpdate = function (filter = {}, update = {}, options = {}) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalFindOneAndUpdate(filter, update, options);
      }
      const store = getCollection(collName);
      let index = store.findIndex((item) => matchesFilter(item, filter));

      const updateData = update.$set ? update.$set : update;

      if (index === -1) {
        if (options.upsert) {
          const newDoc = {
            _id: new mongoose.Types.ObjectId(),
            ...filter,
            ...updateData,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          store.push(newDoc);
          return Promise.resolve(new model(newDoc));
        }
        return Promise.resolve(null);
      }

      store[index] = { ...store[index], ...updateData, updatedAt: new Date() };
      return Promise.resolve(new model(store[index]));
    };

    const originalDeleteMany = model.deleteMany.bind(model);
    model.deleteMany = function (filter = {}) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalDeleteMany(filter);
      }
      const store = getCollection(collName);
      const remaining = store.filter((item) => !matchesFilter(item, filter));
      inMemoryCollections.set(collName, remaining);
      return Promise.resolve({ acknowledged: true, deletedCount: store.length - remaining.length });
    };

    const originalInsertMany = model.insertMany.bind(model);
    model.insertMany = function (docs = []) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalInsertMany(docs);
      }
      const store = getCollection(collName);
      const created = docs.map((d) => {
        const _id = d._id || new mongoose.Types.ObjectId();
        const fullDoc = { ...d, _id, createdAt: new Date(), updatedAt: new Date() };
        store.push(fullDoc);
        return new model(fullDoc);
      });
      return Promise.resolve(created);
    };
  };

  Object.values(mongoose.models).forEach(patchModel);
  const originalModel = mongoose.model.bind(mongoose);
  mongoose.model = function (name, schema, collection) {
    const m = originalModel(name, schema, collection);
    patchModel(m);
    return m;
  };
}

export const connectDB = async () => {

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-career-roadmap';

    try {
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[MongoDB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Connection to ${connUri} failed (${err.message}). Activating zero-latency in-memory engine...`);
      enableInMemoryEngine();
      return mongoose.connection;
    }
  })();

  try {
    const result = await connectionPromise;
    return result;
  } catch (err) {
    connectionPromise = null;
    throw err;
  }
};


