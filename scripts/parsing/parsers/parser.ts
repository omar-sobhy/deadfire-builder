import type {
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Transaction,
} from 'sequelize';
import { sequelize } from '../../../src/lib/db/index.ts';
import { Logger } from '../../../src/lib/utils.js';

export abstract class Parser<
  T extends { ID: string },
  M extends Model,
  N extends typeof Model<InferAttributes<M>, InferCreationAttributes<M>>,
> {
  public abstract readonly type: string | RegExp;

  public readonly raw: Record<string, T> = {};
  public readonly parsed: CreationAttributes<M>[] = [];

  public abstract readonly model: N;

  public matches(o: unknown): boolean {
    if (
      typeof o !== 'object' ||
      o === null ||
      !('$type' in o) ||
      typeof o.$type !== 'string'
    ) {
      return false;
    }

    if (typeof this.type === 'string') {
      return o.$type.startsWith(this.type);
    }

    return o.$type.match(this.type) !== null;
  }

  public abstract parse(o: unknown):
    | {
        raw: T;
        parsed: CreationAttributes<M>;
      }
    | undefined;

  public parseAndPush(o: unknown) {
    try {
      const obj = this.parse(o);
      if (!obj) {
        return;
      }

      const { parsed, raw } = obj;

      if (this.raw[raw.ID]) {
        Logger.getInstance().warn(
          `Skipping ${raw.ID} because it was already parsed`,
        );
        return;
      }

      this.raw[raw.ID] = raw;

      this.parsed.push(parsed);
    } catch (error) {
      console.dir(o, { depth: Infinity });
      throw error;
    }
  }

  public abstract bulkCreate(): Promise<M[]>;

  public async addReferences() {
    const transaction = await sequelize.transaction();

    // @ts-expect-error hack to generically query/use models
    const allModels = await this.model.findAll();

    for (const m of allModels) {
      // @ts-expect-error hack to generically query/use models
      await this.addStringTableReferences(m, transaction);

      // @ts-expect-error hack to generically query/use models
      await this._addReferences(m, transaction);

      await m.save({ transaction });
    }

    return await transaction.commit();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async _addReferences(_model: M, _transaction: Transaction) {}

  protected async addStringTableReferences(model: M, transaction: Transaction) {
    if (!('id' in model && typeof model.id === 'string')) {
      Logger.getInstance().warn(`No id in ${model.dataValues}`);
      return;
    }

    const data = this.raw[model.id];

    if ('Components' in data) {
      const data_ = data as typeof data & { Components: object[] };

      await setValueIfExists(
        'DescriptionText',
        data_,
        'setDescriptionText',
        model,
        transaction,
      );

      await setValueIfExists(
        'Description',
        data_,
        'setDescriptionText',
        model,
        transaction,
      );

      await setValueIfExists(
        'DisplayName',
        data_,
        'setDisplayName',
        model,
        transaction,
      );

      await setValueIfExists(
        'SummaryText',
        data_,
        'setSummaryText',
        model,
        transaction,
      );
    }

    await model.save({ transaction });
  }
}

async function setValueIfExists(
  name: string,
  data: { ID: string; Components: object[] },
  setterName: string,
  model: Model,
  transaction: Transaction,
) {
  const component = data.Components.find((c) => name in c);

  if (!component) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (component as any)[name];

  if (value === -1) {
    return;
  }

  if (!(setterName in model)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setter = (model as any)[setterName];

  if (typeof setter !== 'function') {
    return;
  }

  try {
    await setter.bind(model)(value, { transaction });
    await model.save({ transaction });
  } catch (error) {
    // @ts-expect-error unknown error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      // @ts-expect-error table name...
      const tableName = model.constructor.tableName;
      Logger.getInstance().warn(
        `Missing string '${name}' reference ${value} (model=${tableName}, id=${data.ID})`,
      );

      await setter.bind(model)(null, { transaction });
      await model.save({ transaction });

      return;
    }

    throw error;
  }
}
