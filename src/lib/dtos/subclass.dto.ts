import type { SubclassModel } from '$lib/db/index.js';

export class SubclassDto {
  private constructor(
    public readonly id: string,
    public readonly classId: string,
    public readonly displayName: string,
  ) {}

  public static async from(model: SubclassModel) {
    const { id } = model;

    const classId = (await model.getClass()).id;
    const displayName = (await model.getDisplayName()).defaultText;

    return new this(id, classId, displayName);
  }
}
