import z from 'zod';
import { RaceType } from '../enums/race.js';

export const raceComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.RaceComponent'),
  Type: z.enum(RaceType),

  IsKith: z.string().pipe(z.transform((s) => s === 'true')),

  /**
   * ID in gui string table
   */
  DisplayName: z.number(),

  /**
   * ID in cyclopedia string table
   */
  SummaryText: z.number(),

  /**
   * ID in gui string table
   */
  DescriptionText: z.number(),

  Icon: z.string(),

  Resolve: z.number(),
  Might: z.number(),
  Dexterity: z.number(),
  Intellect: z.number(),
  Constitution: z.number(),
  Perception: z.number(),

  /**
   * SubraceGameData references
   */
  CharacterCreationSubracesIDs: z.array(z.string()),
});
