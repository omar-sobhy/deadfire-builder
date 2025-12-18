import type { SubraceModel } from '$lib/db/index.js';

export class SubraceDto {
  private constructor(
    public readonly id: string,
    public readonly raceId: string,
    public readonly displayName: string,
    public readonly summary?: string,
    public readonly description?: string,
  ) {}

  public static async from(model: SubraceModel) {
    const { id } = model;

    const raceId = (await model.getRace()).id;
    const summary = (await model.getSummaryText())?.defaultText;
    const displayName = (await model.getDisplayName()).defaultText;
    const description = (await model.getDescriptionText())?.defaultText;

    return new this(id, raceId, displayName, summary, description);
  }
}
