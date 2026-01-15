import { DeadfireDbInstance } from '$lib/server/db-instance.js';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { zSavedBuild, type SavedBuild } from '../../types/saved-build.js';
import type { CouchdbModel } from '$lib/db/couchdb/model.js';
import z from 'zod';

export const GET: RequestHandler = async ({ url }) => {
  const buildId = url.searchParams.get('build');
  if (!buildId) {
    error(400, { message: 'Missing buildId' });
  }

  const db = await DeadfireDbInstance();

  try {
    const build = await db.savedBuilds.get({ id: buildId });

    return json(build);
  } catch {
    error(404, { message: 'Invalid buildId' });
  }
};

const schema = z.object({
  data: zSavedBuild,
});

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();

  const result = schema.safeParse(data);
  if (!result.success) {
    error(400, {
      message: 'Invalid body.',
      data: { type: 'invalid-build', data: z.treeifyError(result.error) },
    });
  }

  const db = await DeadfireDbInstance();

  const rows = await (db.savedBuilds as CouchdbModel<{ version: string; data: SavedBuild }>).put({
    rows: [
      {
        data: {
          version: '1.1.0',
          data: result.data.data,
        },
      },
    ],
  });

  return json({ id: rows[0].id });
};
