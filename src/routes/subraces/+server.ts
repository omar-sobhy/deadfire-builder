import {
  AbilityUnlockModel,
  AbilityStringTableModel,
  AbilityUnlockSubraceModel,
  RaceModel,
  SubraceModel,
  CyclopediaStringTableModel,
  GuiStringTableModel,
} from '$lib/db/index.js';
import { AbilityModel } from '$lib/db/models/data/ability/ability.model.js';
import { subraceModeltoDto } from '$lib/server/model-to-dto/index.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const subraces = await SubraceModel.findAll({
    include: [
      { model: GuiStringTableModel, as: 'descriptionText' },
      { model: GuiStringTableModel, as: 'displayName' },
      { model: CyclopediaStringTableModel, as: 'summaryText' },
      { model: RaceModel, as: 'race' },
      {
        model: AbilityUnlockSubraceModel,
        as: 'abilityUnlocks',
        include: [
          {
            model: AbilityUnlockModel,
            as: 'abilityUnlock',
            include: [
              {
                model: AbilityModel,
                as: 'addedAbility',
                include: [
                  { model: AbilityStringTableModel, as: 'displayName' },
                  { model: AbilityStringTableModel, as: 'descriptionText' },
                ],
              },
              { model: AbilityModel, as: 'removedAbility' },
              { model: AbilityModel, as: 'requiredAbility' },
            ],
          },
          { model: SubraceModel, as: 'subrace' },
        ],
      },
    ],
  });

  const subraceDtos = await Promise.all(
    subraces.map((s) => subraceModeltoDto(s)),
  );

  return json(subraceDtos);
}
