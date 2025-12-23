import { type CultureModel } from '$lib/db/index.js';
import { CultureDto } from '$lib/dtos/character/culture.dto.js';
import { dereference } from '$lib/utils.js';

export async function cultureModelToDto(model: CultureModel) {
  const { id, resolve, might, dexterity, constitution, intellect, perception } = model;

  const displayName = await dereference(model, 'displayName', model.getDisplayName);

  return new CultureDto(
    id,
    resolve,
    might,
    dexterity,
    constitution,
    intellect,
    perception,
    displayName?.defaultText,
  );
}
