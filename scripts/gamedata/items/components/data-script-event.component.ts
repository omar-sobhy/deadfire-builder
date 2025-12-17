import z from 'zod';

export const dataScriptEventComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.DataScriptEventComponent')
    .transform(() => 'DataScriptEventComponent' as const),
});

export type DataScriptEventComponent = z.infer<
  typeof dataScriptEventComponentSchema
>;
