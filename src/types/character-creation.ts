type RaceName = 'human' | 'aumaua' | 'dwarf' | 'elf' | 'orlan' | 'godlike';

type RaceLabel = Capitalize<RaceName>;

type StatName =
	| 'might'
	| 'constitution'
	| 'dexterity'
	| 'perception'
	| 'intellect'
	| 'resolve';

type Race = {
	value: RaceName;
	label: RaceLabel;
	statChanges: Partial<Record<StatName, number>>;
};

type CultureName =
	| 'aedyr'
	| 'deadfire archipelago'
	| 'ixamitl plains'
	| 'old valia'
	| 'rautai'
	| 'the living lands'
	| 'the white that wends';

type ClassName =
	| 'barbarian'
	| 'chanter'
	| 'cipher'
	| 'druid'
	| 'fighter'
	| 'monk'
	| 'paladin'
	| 'priest'
	| 'ranger'
	| 'rogue'
	| 'wizard';

export type { Race, RaceName, StatName, RaceLabel, CultureName, ClassName };
