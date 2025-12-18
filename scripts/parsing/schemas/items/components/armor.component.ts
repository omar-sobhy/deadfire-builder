import z from 'zod';
import { ArmorCategory } from '../enums/armor-category.js';
import { ArmorMaterial } from '../enums/armor-material.js';

export const armorComponentSchema = z.object({
  $type: z
    .string()
    .startsWith('Game.GameData.ArmorComponent')
    .pipe(z.transform(() => 'ArmorComponent' as const)),

  ArmorRating: z.number(),
  ArmorCategory: z.enum(ArmorCategory),
  ArmorMaterial: z.enum(ArmorMaterial),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverridePierceRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideSlashRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideCrushRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideBurnRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideFreezeRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideShockRating: z.number(),

  /**
   * If >= 0, overrides the base armour's AR
   */
  OverrideCorrodeRating: z.number(),

  LevelScaling: z.object({
    BaseLevel: z.number(),
    LevelIncrement: z.number(),
    MaxLevel: z.number(),
    ArmorRatingAdjustment: z.number(),
  }),
});

export type ArmorComponent = z.infer<typeof armorComponentSchema>;
