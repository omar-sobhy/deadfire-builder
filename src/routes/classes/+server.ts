import {
  AbilityStringTableModel,
  AbilityUnlockClassModel,
  AbilityUnlockModel,
  ClassModel,
  ClassProgressionModel,
  CyclopediaStringTableModel,
  GuiStringTableModel,
} from '$lib/db/index.js';
import { AbilityModel } from '$lib/db/models/data/ability/ability.model.js';
import { classModelToDto } from '$lib/server/model-to-dto/index.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const classes = await ClassModel.findAll({
    include: [
      { model: GuiStringTableModel, as: 'descriptionText' },
      { model: GuiStringTableModel, as: 'displayName' },
      { model: CyclopediaStringTableModel, as: 'summaryText' },
      {
        model: ClassProgressionModel,
        as: 'progressionTable',
        include: [
          {
            model: AbilityUnlockModel,
            as: 'abilityUnlocks',
            include: [
              {
                model: AbilityModel,
                as: 'addedAbility',
                include: [
                  { model: AbilityStringTableModel, as: 'displayName' },
                  { model: AbilityStringTableModel, as: 'descriptionText' },
                ],
              },
              {
                model: AbilityModel,
                as: 'removedAbility',
                include: [
                  { model: AbilityStringTableModel, as: 'displayName' },
                  { model: AbilityStringTableModel, as: 'descriptionText' },
                ],
              },
            ],
          },
        ],
      },
      {
        model: AbilityUnlockClassModel,
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
          { model: ClassModel, as: 'class' },
        ],
      },
    ],
  });

  const classDtos = await Promise.all(classes.map((c) => classModelToDto(c)));

  return json(classDtos);
}
