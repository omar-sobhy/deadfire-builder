import type { GetAllOpts, GetOpts, Model, PutOpts } from '../interfaces';
import type { DocumentResponseRow, DocumentScope } from 'nano';
import type { CreateOpts } from './index.js';

export abstract class CouchdbModel<O> implements Model<O> {
  public db?: DocumentScope<O>;

  public abstract dbName: string;

  private getDbName() {
    return this.dbName;
  }

  public constructor(private opts: CreateOpts) {}

  public async init(): Promise<this> {
    const { nano, init } = this.opts;

    if (init) {
      try {
        await nano.db.destroy(this.dbName);
        await nano.db.create(this.dbName);
      } catch (error) {
        if (
          typeof error !== 'object' ||
          error === null ||
          !('error' in error) ||
          error.error !== 'file_exists'
        ) {
          throw error;
        }
      }
    }

    this.db = nano.use(this.getDbName());

    return this;
  }

  async get(opts: GetOpts): Promise<{ id: string; data: O }> {
    const result = await this.db!.get(opts.id.toString());

    return { id: result._id, data: result };
  }

  async getAll(opts?: GetAllOpts): Promise<{ id: string; data: O }[]> {
    let result;
    if (opts?.ids) {
      result = await this.db!.fetch({ keys: opts.ids.map((i) => i.toString()) });
    } else {
      result = await this.db!.list({ include_docs: true });
    }

    const rows = result.rows as DocumentResponseRow<O>[];

    return rows.map((r) => ({ id: r.id, data: r.doc! }));
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
