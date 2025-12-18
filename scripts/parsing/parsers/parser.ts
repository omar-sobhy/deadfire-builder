import type {
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export abstract class Parser<
  T extends { ID: string },
  M extends Model,
  N extends typeof Model<InferAttributes<M>, InferCreationAttributes<M>>,
> {
  public abstract readonly type: string;

  protected readonly raw: Record<string, T> = {};
  protected readonly parsed: InferCreationAttributes<M>[] = [];

  public abstract readonly model: N;

  public matches(o: unknown): boolean {
    return (
      typeof o === 'object' &&
      o !== null &&
      '$type' in o &&
      typeof o.$type === 'string' &&
      o.$type.startsWith(this.type)
    );
  }

  public abstract parse(o: unknown):
    | {
        raw: T;
        parsed: InferCreationAttributes<M>;
      }
    | undefined;

  public parseAndPush(o: unknown) {
    try {
      const obj = this.parse(o);
      if (!obj) {
        return;
      }

      const { parsed, raw } = obj;

      this.raw[raw.ID] = raw;

      this.parsed.push(parsed);
    } catch (error) {
      console.dir(o);
      throw error;
    }
  }

  public abstract bulkCreate(): Promise<M[]>;

  public async addReferences() {
    const entries = Object.entries(this.raw);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_k, v] of entries) {
      // @ts-expect-error hack to generically query/use models
      const instance = await this.model.findByPk(v.ID);

      // @ts-expect-error hack to generically query/use models
      await this.addStringTableReferences(instance);

      // @ts-expect-error hack to generically query/use models
      await this._addReferences(instance);

      await instance.save();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async _addReferences(_model: M) {}

  protected async addStringTableReferences(model: M) {
    if (!('id' in model && typeof model.id === 'string')) {
      console.warn(`No id in ${model.dataValues}`);
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
      );

      await setValueIfExists('DisplayName', data_, 'setDisplayName', model);

      await setValueIfExists('SummaryText', data_, 'setSummaryText', model);
    }

    await model.save();
  }
}

async function setValueIfExists(
  name: string,
  data: { ID: string; Components: object[] },
  setterName: string,
  model: Model,
) {
  const component = data.Components.find((c) => name in c);

  if (!component) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (component as any)[name];

  if (!(setterName in model)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setter = (model as any)[setterName];

  if (typeof setter !== 'function') {
    return;
  }

  return setter(value, { save: false });
}
