import type { CultureModel } from '$lib/db/index.js';

export class CultureDto {
  private constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly resolve: number,
    public readonly might: number,
    public readonly dexterity: number,
    public readonly constitution: number,
    public readonly intellect: number,
    public readonly perception: number,
  ) {}

  public static async from(model: CultureModel) {
    const {
      id,
      resolve,
      might,
      dexterity,
      constitution,
      intellect,
      perception,
    } = model;

    const displayName = (await model.getDisplayName()).defaultText;

    return new this(
      id,
      displayName,
      resolve,
      might,
      dexterity,
      constitution,
      intellect,
      perception,
    );
  }
}
