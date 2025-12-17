import z from 'zod';
import { SubraceType } from '../enums/subrace.js';

export const subraceComponentSchema = z.object({
  $type: z.string().startsWith('Game.GameData.SubraceComponent'),
  Type: z.enum(SubraceType),

  /**
   * RaceGameData reference
   */
  RaceID: z.string(),

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

  /**
   * GenericAbilityGameData reference
   */
  OptionalAbilityReferencesIDs: z.array(z.string()),
});

export type SubraceComponent = z.infer<typeof subraceComponentSchema>;
