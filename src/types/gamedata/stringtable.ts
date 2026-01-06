export interface ParsedStringTable {
  StringTableFile: {
    Entries: {
      Entry: { ID: number; DefaultText: string; FemaleText: string }[];
    };
  };
}

export interface StringTableEntry {
  id: number;
  defaultText: string;
  femaleText: string;
}
