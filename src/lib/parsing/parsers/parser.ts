import type { DbKeys, ReadWriteTransaction } from '../../../types/index-db.js';
import type z from 'zod';

export abstract class Parser<Parsed extends { ID: string }> {
  public readonly parsed: Record<string, Parsed> = {};

  public abstract parser: z.ZodType<Parsed>;

  public parseAndPush(o: unknown): boolean {
    const result = this.parser.safeParse(o);
    if (!result.success) {
      return false;
    }

    this.parsed[result.data.ID] = result.data;
    return true;
  }

  public constructor(public readonly transaction: ReadWriteTransaction<DbKeys>) {}

  public abstract toDto(): Promise<void>;
}
