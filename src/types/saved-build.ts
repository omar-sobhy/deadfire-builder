import z from 'zod';

export const zStats = z.object({
  might: z.number(),
  constitution: z.number(),
  dexterity: z.number(),
  perception: z.number(),
  intellect: z.number(),
  resolve: z.number(),
});

export const zSavedBuild = z.object({
  selectedRaceId: z.string(),
  selectedSubraceId: z.string(),
  attributes: zStats,
  selectedCultureId: z.string(),
  selectedClassId: z.string(),
  selectedSubclassId: z.string().optional(),
  selectedMulticlassId: z.string().optional(),
  selectedMultiSubclassId: z.string().optional(),
  abilities: z.array(z.string()),
  autoAbilities: z.array(z.string()),
});

export type Stats = z.infer<typeof zStats>;

export type SavedBuild = z.infer<typeof zSavedBuild>;

// export interface SavedBuild {
//   selectedRaceId: string;
//   selectedSubraceId: string;
//   attributes: Map<string, number>;
//   selectedCultureId: string;
//   selectedClassId: string;
//   selectedSubclassId: string;
//   selectedMulticlassId: string;
//   selectedMultiSubclassId: string;
// }
