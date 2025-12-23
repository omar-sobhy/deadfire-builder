export interface ParsedStringTable {
  StringTableFile: {
    Entries: {
      Entry: { ID: number; DefaultText: string; FemaleText: string }[];
    };
  };
}
