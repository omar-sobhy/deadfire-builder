import type { RaceModel } from '$lib/db/index.js';

export class RaceDto {
  private constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly subRaceIds: string[],
    public readonly resolve: number,
    public readonly might: number,
    public readonly dexterity: number,
    public readonly constitution: number,
    public readonly intellect: number,
    public readonly perception: number,
    public readonly isKith: boolean,
  ) {}

  static async from(model: RaceModel) {
    const {
      id,
      resolve,
      might,
      dexterity,
      constitution,
      intellect,
      perception,
      isKith,
    } = model;

    const displayName = (await model.getDisplayName()).defaultText;

    const subraces = await model.getSubraces();
    const subraceIds = subraces.map((s) => s.id);

    return new this(
      id,
      displayName,
      subraceIds,
      resolve,
      might,
      dexterity,
      constitution,
      intellect,
      perception,
      isKith,
    );
  }
}
