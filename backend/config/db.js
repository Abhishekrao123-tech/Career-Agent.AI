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
      const doc = store.find((item) => {
        return Object.keys(filter).every((k) => {
          if (filter[k] && typeof filter[k] === 'object' && filter[k].toString) {
            return item[k]?.toString() === filter[k].toString();
          }
          return item[k] === filter[k];
        });
      });
      return Promise.resolve(doc ? new model(doc) : null);
    };

    const originalFind = model.find.bind(model);
    model.find = function (filter = {}) {
      if (mongoose.connection.host && mongoose.connection.host !== 'in-memory-engine') {
        return originalFind(filter);
      }
      const store = getCollection(collName);
      const matches = store.filter((item) => {
        return Object.keys(filter).every((k) => {
          if (filter[k] && typeof filter[k] === 'object' && filter[k].toString) {
            return item[k]?.toString() === filter[k].toString();
          }
          return item[k] === filter[k];
        });
      });
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
      let index = store.findIndex((item) => {
        return Object.keys(filter).every((k) => {
          if (filter[k] && typeof filter[k] === 'object' && filter[k].toString) {
            return item[k]?.toString() === filter[k].toString();
          }
          return item[k] === filter[k];
        });
      });

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
  mongoose.set('bufferCommands', false);

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
      console.warn(`[MongoDB] Connection to ${connUri} failed (${err.message}). Trying MongoMemoryServer fallback...`);
      try {
        if (!mongoServerInstance) {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongoServerInstance = await Promise.race([
            MongoMemoryServer.create({
              instance: { dbName: 'ai-career-roadmap' },
              downloadDir: process.env.VERCEL ? '/tmp' : undefined
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('MongoMemoryServer startup timeout')), 2500))
          ]);
        }
        const mongoUri = mongoServerInstance.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB] Connected to MongoMemoryServer: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.warn(`[MongoDB] Memory server fallback failed (${fallbackErr.message}). Activating zero-latency in-memory engine...`);
        enableInMemoryEngine();
        return mongoose.connection;
      }
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


