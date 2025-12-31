import { type Knex } from 'knex';
import type { Tables } from 'knex/types/tables.js';

export interface GetOpts {
  ids: (string | number)[];
}

export class Model<O> {
  public readonly db: Knex;

  public readonly tableName?: keyof Tables;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getAll(): Promise<{ id: string | number; data: O }[]> {
    return await this.db.from(this.getTableName());
  }

  public async get(opts: GetOpts): Promise<{ id: string | number; data: O }[]> {
    const result = await this.db.table(this.getTableName()).select('*').whereIn('id', opts.ids);

    return result;
  }

  public getTableName(): string {
    if (this.tableName) {
      return this.tableName;
    }

    return this.constructor.name.toLowerCase();
  }

  public async put(rows: { id: string | number; data: O }[]) {
    const chunkSize = 500;

    const toInsert = rows.map((r) => ({ id: r.id, data: JSON.stringify(r.data) }));

    for (let i = 0; i < rows.length; i += chunkSize) {
      const transaction = await this.db.transaction();

      for (let j = 0; j < chunkSize && i + j < rows.length; ++j) {
        await transaction.table(this.getTableName()).insert(toInsert[i + j]);
      }

      await transaction.commit();
    }
  }
}
