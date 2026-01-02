import { CouchdbDeadfireDb } from './couchdb/index.js';
import Nano, { type ServerScope } from 'nano';

const env = process.env;

const { COUCHDB_USER, COUCHDB_URL, COUCHDB_PASSWORD } = env;

let context: { nano: ServerScope; db: CouchdbDeadfireDb };

export async function DeadfireDbInstance() {
  if (context) {
    return context.db;
  }

  const nano = Nano({
    url: `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_URL}`,
  });

  const db = await CouchdbDeadfireDb.create({
    nano,
  });

  context = { nano, db };

  return db;
}

export * from './interfaces';
