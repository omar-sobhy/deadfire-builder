import z from 'zod';

export const itemComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ItemComponent')
    .pipe(z.transform(() => 'ItemComponent' as const)),

  /**
   * ID in the items string table
   */
  DisplayName: z.number(),

  /**
   * ID in the items string table
   */
  DescriptionText: z.number(),

  IsIngredient: z.string().transform((s) => s === 'true'),
  IsCurrency: z.string().transform((s) => s === 'true'),
  IsUnique: z.string().transform((s) => s === 'true'),

  IconTextureSmall: z.string(),
  IconTextureLarge: z.string(),
});

export type ItemComponent = z.infer<typeof itemComponentSchema>;
