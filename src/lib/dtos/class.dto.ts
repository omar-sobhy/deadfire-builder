import type { ClassModel } from '$lib/db/index.js';

export class ClassDto {
  private constructor(
    public readonly id: string,
    public readonly displayName: string,
  ) {}

  static async from(model: ClassModel) {
    const { id } = model;

    const displayName = (await model.getDisplayName()).defaultText;

    return new this(id, displayName);
  }
}
