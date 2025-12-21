import {
  AbilityStringTableModel,
  AbilityUnlockModel,
  AbilityUnlockSubclassModel,
  ClassModel,
  CyclopediaStringTableModel,
  GuiStringTableModel,
  SubclassModel,
} from '$lib/db/index.js';
import { AbilityModel } from '$lib/db/models/data/ability/ability.model.js';
import { subclassModelToDto } from '$lib/server/model-to-dto/index.js';
import { json } from '@sveltejs/kit';
import { Op } from 'sequelize';

export async function GET() {
  const subclasses = await SubclassModel.findAll({
    where: {
      class_id: {
        [Op.notLike]: 'null',
      },
    },
    include: [
      { model: GuiStringTableModel, as: 'descriptionText' },
      { model: GuiStringTableModel, as: 'displayName' },
      { model: CyclopediaStringTableModel, as: 'summaryText' },
      { model: ClassModel, as: 'class' },
      {
        model: AbilityUnlockSubclassModel,
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
          { model: SubclassModel, as: 'subclass' },
        ],
      },
    ],
  });

  const subclassDtos = await Promise.all(
    subclasses.map((s) => subclassModelToDto(s)),
  );

  return json(subclassDtos);
}
