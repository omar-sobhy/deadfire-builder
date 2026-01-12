import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import {
  progressionTableManagerGameDataSchema,
  type ProgressionTableManagerGameData,
} from '$lib/parsing/schemas/global/gamedata/progression-table-manager.gamedata.js';
import { conditionalCallSchema } from '$lib/parsing/schemas/progression/components/base-progression.component.js';
import type { ClassProgressionGameData } from '$lib/parsing/schemas/progression/gamedata/class-progression.gamedata.js';
import type z from 'zod';
import { Parser } from '../parser.js';
import {
  isRegularConditional,
  type ConditionalDto,
} from '$lib/dtos/progression/conditional.dto.js';

export class ProgressionTableManagerParser extends Parser<ProgressionTableManagerGameData> {
  public override readonly parser = progressionTableManagerGameDataSchema;

  private static parseConditionalCall(
    conditional: z.infer<typeof conditionalCallSchema>,
  ): ConditionalDto | undefined {
    const name = conditional.Data.FullName;

    let type: ConditionalDto['type'] | undefined;

    if (name.includes('IsRace')) {
      type = 'race';
    }

    if (name.includes('IsSubrace')) {
      type = 'subrace';
    }

    if (name.includes('IsSubclass')) {
      type = 'subclass';
    }

    if (name.includes('IsClass')) {
      type = 'class';
    }

    if (name.includes('AlwaysFalse')) {
      return {
        type: 'always-false',
        not: conditional.Not,
      };
    }

    if (name.includes('IsPartyMember') && conditional.Not) {
      return {
        type: 'is-party-member',
        not: conditional.Not,
      };
    }

    if (type === undefined) {
      return;
    }

    return {
      type,
      operator: conditional.Operator,
      parameter: conditional.Data.Parameters[0],
      not: conditional.Not,
    };
  }

  private static parseProgressionTable(table: ClassProgressionGameData): AbilityUnlockDto[] {
    const component = table.Components.find((c) => c.$type === 'BaseProgressionTableComponent')!;

    const abilities: AbilityUnlockDto[] = [];

    for (const a of component.AbilityUnlocks) {
      const addedAbility = Parser.context.abilities[a.AddAbilityID];
      const removedAbility = Parser.context.abilities[a.RemoveAbilityID];
      const requiredAbility = Parser.context.abilities[a.Prerequisites.RequiresAbilityID];

      const conditionals = [];
      for (const c of a.Prerequisites.Conditional.Components) {
        if (c.$type === 'ConditionalCall') {
          conditionals.push(c);
        } else {
          for (const conditional of c.Components) {
            conditionals.push(conditional);
          }
        }
      }

      const parsedConditionals = conditionals
        .map((c) => this.parseConditionalCall(c))
        .filter((c) => !!c);

      const visibilityConditionals = [];
      for (const c of a.Prerequisites.VisibilityConditional.Components) {
        if (c.$type === 'ConditionalCall') {
          visibilityConditionals.push(c);
        } else {
          for (const conditional of c.Components) {
            visibilityConditionals.push(conditional);
          }
        }
      }

      const parsedVisibilityConditionals = visibilityConditionals
        .map((c) => this.parseConditionalCall(c))
        .filter((c) => !!c);

      abilities.push({
        baseClassId: a.Prerequisites.PowerLevelRequirement.ClassID,
        category: a.Category,
        conditionals: parsedConditionals,
        visibilityConditionals: parsedVisibilityConditionals,
        icon: addedAbility.icon,
        minimumCharacterLevel: a.Prerequisites.MinimumCharacterLevel,
        minimumPowerLevel: a.Prerequisites.PowerLevelRequirement.MinimumPowerLevel,
        mutuallyExclusive: a.Prerequisites.IsMutuallyExclusiveUpgrade,
        note: a.Note,
        style: a.UnlockStyle,
        addedAbility,
        removedAbility,
        requiredAbility,
      });
    }

    return abilities;
  }

  public async parseDtos(): Promise<void> {
    const manager = Object.values(this.parsed)[0];

    const component = manager.Components[0];

    for (const c of component.ClassTables) {
      const { CharacterClassID, TableID } = c;

      const table = Parser.context.classProgressionTables[TableID];

      const parsed = ProgressionTableManagerParser.parseProgressionTable(table);

      Parser.context.classUnlocks[CharacterClassID] = parsed;
    }

    const racialId = component.RacialProgressionTableID;

    const table = Parser.context.classProgressionTables[racialId];

    const parsed = ProgressionTableManagerParser.parseProgressionTable(table);

    for (const p of parsed) {
      const raceConditional = p.conditionals.find((c) => c.type === 'race');

      const isForNpc = p.conditionals.find((c) => c.type === 'is-party-member')?.not;

      if (isForNpc) {
        continue;
      }

      if (raceConditional && isRegularConditional(raceConditional)) {
        Parser.context.raceUnlocks[raceConditional.parameter] ??= [];
        Parser.context.raceUnlocks[raceConditional.parameter].push(p);
      }

      const subraceConditional = p.conditionals.find((c) => c.type === 'subrace');
      if (subraceConditional && isRegularConditional(subraceConditional)) {
        Parser.context.subraceUnlocks[subraceConditional.parameter] ??= [];
        Parser.context.subraceUnlocks[subraceConditional.parameter].push(p);
      }
    }
  }
}
