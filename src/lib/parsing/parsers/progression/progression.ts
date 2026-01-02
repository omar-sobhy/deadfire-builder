import { conditionalCallSchema } from '$lib/parsing/schemas/progression/components/base-progression.component.js';
import {
  classProgressionGameDataSchema,
  type ClassProgressionGameData,
} from '$lib/parsing/schemas/progression/gamedata/class-progression.gamedata.js';
import type z from 'zod';
import { Parser } from '../parser.js';
import { Logger } from '$lib/utils.js';
import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';

interface Condition {
  type: 'race' | 'subrace' | 'class' | 'subclass';
  id: string;
}

export class UnlockParser extends Parser<ClassProgressionGameData> {
  public override readonly parser = classProgressionGameDataSchema;

  private static parseConditionalCall(
    conditional: z.infer<typeof conditionalCallSchema>,
  ): Condition | undefined {
    if (conditional.Not) {
      return;
    }

    const name = conditional.Data.FullName;

    const id = conditional.Data.Parameters[0];

    if (name.includes('IsRace')) {
      return { type: 'race', id } as const;
    }

    if (name.includes('IsSubrace')) {
      return { type: 'subrace', id } as const;
    }

    if (name.includes('IsSubclass')) {
      return { type: 'subclass', id } as const;
    }

    if (name.includes('IsClass')) {
      return { type: 'class', id } as const;
    }
  }

  private push(
    intermediate: Omit<AbilityUnlockDto, 'progressionDetails'>,
    condition: z.infer<typeof conditionalCallSchema>,
  ) {
    const { subclassUnlocks, classUnlocks, raceUnlocks, subraceUnlocks } = Parser.context;

    const map = {
      subclass: subclassUnlocks,
      class: classUnlocks,
      race: raceUnlocks,
      subrace: subraceUnlocks,
    };

    const parsedCondition = UnlockParser.parseConditionalCall(condition);
    if (!parsedCondition) {
      classUnlocks[intermediate.baseClassId] ??= [];
      classUnlocks[intermediate.baseClassId].push({
        ...intermediate,
        progressionDetails: {
          type: 'class',
          id: intermediate.baseClassId,
        },
      });
    } else {
      switch (parsedCondition.type) {
        case 'class':
        case 'subclass':
        case 'race':
        case 'subrace': {
          map[parsedCondition.type][parsedCondition.id] ??= [];
          map[parsedCondition.type][parsedCondition.id].push({
            ...intermediate,
            progressionDetails: {
              type: parsedCondition.type,
              id: parsedCondition.id,
            },
          });
          break;
        }
      }
    }
  }

  public override async parseDtos() {
    const { abilities } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const classComponent = data.Components.find(
        (c) => c.$type === 'ClassProgressionTableComponent',
      );

      if (!classComponent) {
        Logger.getInstance().warn(
          `[Unlock] ${data.DebugName} (${data.ID}) has no ClassProgressionTableComponent`,
        );
        continue;
      }

      const baseComponent = data.Components.find(
        (c) => c.$type === 'BaseProgressionTableComponent',
      );

      if (!baseComponent) {
        Logger.getInstance().warn(
          `[Unlock] ${data.DebugName} (${data.ID}) has no BaseProgressionTableComponent`,
        );
        continue;
      }

      for (const a of baseComponent.AbilityUnlocks) {
        const conditionals = a.Prerequisites.Conditional.Components;
        const requiredAbility = abilities[a.Prerequisites.RequiresAbilityID];
        const addedAbility = abilities[a.AddAbilityID];
        const removedAbility = abilities[a.RemoveAbilityID];

        const classId = a.Prerequisites.PowerLevelRequirement.ClassID;

        const intermediate = {
          note: a.Note,
          icon: addedAbility?.icon ?? '',
          category: a.Category,
          style: a.UnlockStyle,
          baseClassId: classId,
          minimumCharacterLevel: a.Prerequisites.MinimumCharacterLevel,
          mutuallyExclusive: a.Prerequisites.IsMutuallyExclusiveUpgrade,
          minimumPowerLevel: a.Prerequisites.PowerLevelRequirement.MinimumPowerLevel,
          addedAbility,
          requiredAbility,
          removedAbility,
        };

        for (const c of conditionals) {
          if (c.$type === 'ConditionalCall') {
            this.push(intermediate, c);
          } else if (c.$type === 'ConditionalExpression') {
            for (const call of c.Components) {
              if (call.$type === 'ConditionalCall') {
                this.push(intermediate, call);
              }
            }
          }
        }
      }
    }
  }
}
