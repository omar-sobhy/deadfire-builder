import { DeadfireDbInstance } from '$lib/db/index.js';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const db = await DeadfireDbInstance();

  const tables = {
    ability: db.abilityStrings,
    cyclopedia: db.cyclopediaStrings,
    gui: db.guiStrings,
    statuseffect: db.statusEffectStrings,
    item: db.itemStrings,
    itemmod: db.itemModStrings,
    character: db.characterStrings,
  };

  if (!params.tableName || !params.id) {
    error(404, 'Table not found');
  }

  const tableName = params.tableName.toLowerCase();

  if (!(tableName in tables)) {
    error(404, 'Table not found');
  }

  const table = tables[tableName as keyof typeof tables];

  const record = await table.getAll({ ids: [params.id] });

  if (!record) {
    error(404, 'Record not found');
  }

  return json(record);
};
