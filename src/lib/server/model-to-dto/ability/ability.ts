import type { AbilityModel } from '$lib/db/models/data/ability/ability.model.js';
import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import { dereference } from '$lib/utils.js';

export async function abilityModelToDto(model: AbilityModel): Promise<AbilityDto> {
  const { id, debugName, icon } = model;

  const displayName = await dereference(model, 'displayName', model.getDisplayName);

  const description = await dereference(model, 'descriptionText', model.getDescriptionText);

  return {
    id,
    debugName,
    displayName: displayName?.defaultText,
    icon,
    description: description?.defaultText,
  };
}
