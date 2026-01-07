import type { GetAllOpts, GetOpts, Model, PutOpts } from '../interfaces';
import type { DocumentScope } from 'nano';
import type { CreateOpts } from './index.js';
import { containsValue } from '$lib/utils.js';

export abstract class CouchdbModel<O> implements Model<O> {
  public db?: DocumentScope<{ id: string | number; data: O }>;

  public abstract dbName: string;

  private getDbName() {
    return this.dbName;
  }

  public constructor(private opts: CreateOpts) {}

  public async create(clear: boolean = false) {
    const { nano } = this.opts;

    if (clear) {
      try {
        await nano.db.destroy(this.dbName);
      } catch (error) {
        if (!containsValue(error, 'error', 'not_found')) {
          throw error;
        }
      }
    }

    try {
      await nano.db.create(this.dbName);
    } catch (error) {
      if (!containsValue(error, 'error', 'file_exists')) {
        throw error;
      }
    }

    this.db = nano.use(this.getDbName());
  }

  public async init(): Promise<this> {
    const { init } = this.opts;

    await this.create(init);

    return this;
  }

  async get(opts: GetOpts): Promise<{ id: string; data: O }> {
    const result = await this.db!.get(opts.id.toString());

    return { id: result._id, data: result.data };
  }

  async getAll(opts?: GetAllOpts): Promise<{ id: string | number; data: O }[]> {
    if (opts?.ids && opts.ids.length !== 0) {
      const result = await this.db!.find({
        selector: {
          id: {
            $in: opts?.ids ?? [],
          },
        },
      });

      return result.docs.map((d) => ({ id: d.id, data: d.data }));
    }

    const result = await this.db!.list({ include_docs: true });

    return result.rows.map((r) => ({ id: r.doc!.id, data: r.doc!.data }));
  }

  async put(opts: PutOpts<O>): Promise<{ id: string }[]> {
    if (opts.rows.length === 0) {
      return [];
    }

    const result = await this.db!.bulk({
      docs: opts.rows,
    });

    return result.map((r) => ({ id: r.id }));
  }
}
