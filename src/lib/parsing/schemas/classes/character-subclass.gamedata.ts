import z from 'zod';
import { characterSubclassComponentSchema } from './components/character-subclass.component.js';

export const characterSubclassGameDataSchema = z.object({
  $type: z.union([
    z
      .string()
      .includes('CharacterSubClassGameData')
      .transform(() => 'CharacterSubClassGameData' as const),
    z
      .string()
      .includes('PaladinSubClassGameData')
      .transform(() => 'PaladinSubClassGameData' as const),
    z
      .string()
      .includes('PriestSubClassGameData')
      .transform(() => 'PriestSubClassGameData' as const),
  ]),
  DebugName: z.string(),
  ID: z.string(),
  // todo: create schemas for priest and paladin orders
  Components: z.array(
    characterSubclassComponentSchema.or(
      z.object({
        $type: z.string(),
      }),
    ),
  ),
});

export type CharacterSubclassGameData = z.infer<
  typeof characterSubclassGameDataSchema
>;
