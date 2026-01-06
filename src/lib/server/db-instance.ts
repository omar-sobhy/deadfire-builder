import { COUCHDB_URL, COUCHDB_PASSWORD, COUCHDB_USER } from '$env/static/private';
import Nano, { type ServerScope } from 'nano';
import { CouchdbDeadfireDb } from '../db/couchdb/index.js';

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
