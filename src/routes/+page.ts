import type {
	ClassName,
	CultureName,
	Race,
	RaceName,
	StatName,
} from '../types/character-creation';
import type { PageLoad } from './$types';

const races: Race[] = [
	{
		value: 'human',
		label: 'Human',
		statChanges: {
			might: 1,
			resolve: 1,
		},
	},
	{
		value: 'aumaua',
		label: 'Aumaua',
		statChanges: {
			might: 2,
		},
	},
	{
		value: 'dwarf',
		label: 'Dwarf',
		statChanges: {
			might: 2,
			constitution: 1,
			dexterity: -1,
		},
	},
	{
		value: 'elf',
		label: 'Elf',
		statChanges: {
			dexterity: 1,
			perception: 1,
		},
	},
	{
		value: 'orlan',
		label: 'Orlan',
		statChanges: {
			perception: 2,
			resolve: 1,
			might: -1,
		},
	},
	{
		value: 'godlike',
		label: 'Godlike',
		statChanges: {
			dexterity: 1,
			intellect: 1,
		},
	},
];

const subraces: Record<
	RaceName,
	{ label: string; value: string; abilityDescription: string }[]
> = {
	human: [
		{
			label: 'Meadow',
			value: 'meadow',
			abilityDescription:
				'All folk have an indomitable spirit that rises to the challenge when things look grim. Whenever a folk is below 50% Endurance, they gain a bonus to Accuracy and damage.',
		},
		{
			label: 'Ocean',
			value: 'ocean',
			abilityDescription:
				'All folk have an indomitable spirit that rises to the challenge when things look grim. Whenever a folk is below 50% Endurance, they gain a bonus to Accuracy and damage.',
		},
		{
			label: 'Savannah',
			value: 'savannah',
			abilityDescription:
				'All folk have an indomitable spirit that rises to the challenge when things look grim. Whenever a folk is below 50% Endurance, they gain a bonus to Accuracy and damage.',
		},
	],
	elf: [
		{
			label: 'Wood',
			value: 'wood',
			abilityDescription:
				'Against any enemy that is more than 4m away, you gain a bonus to Accuracy, Deflection, and Reflex.',
		},
		{
			label: 'Pale',
			value: 'pale',
			abilityDescription:
				"The pale elves' long history of living in inhospitable climates have given them an inherent resistance to Burn and Freeze damage.",
		},
	],
	dwarf: [
		{
			label: 'Mountain',
			value: 'mountain',
			abilityDescription:
				'Mountain dwarves are the most well-traveled race in Eora. Their incredible journeys have exposed them to all manner of lethal poisons and horrific diseases. As a result, all living mountain dwarves have a strong resistance to both.',
		},
		{
			label: 'Boreal',
			value: 'boreal',
			abilityDescription:
				'In the traditional lands of the boreal dwarves, primordial creatures (oozes, sentient fungi and plants) and wilder (ogres, skuldrs, trolls, vithrack, and xaurips) have long preyed on isolated hunters. Generations of conflict with these creatures has given the boreal dwarves inherent Accuracy bonuses against them.',
		},
	],
	aumaua: [
		{
			label: 'Coastal',
			value: 'coastal',
			abilityDescription: `Coastal aumaua are renowned for their natural "sea legs" and sturdy builds. Whether it's due to their long history of seafaring or something that has been innate within them for generations, all coastal aumaua have an inherent resistance to being Stunned or knocked Prone.`,
		},
		{
			label: 'Island',
			value: 'island',
			abilityDescription: 'All island aumaua gain an additional Weapon Set.',
		},
	],
	orlan: [
		{
			label: 'Hearth',
			value: 'hearth',
			abilityDescription:
				'When hearth orlans attack a target that is also being targeted by a teammate, they convert some of their Hits to Crits.',
		},
		{
			label: 'Wild',
			value: 'wild',
			abilityDescription:
				'After being subjected to a Will attack, wild orlans temporarily gain a bonus to all defenses.',
		},
	],
	godlike: [
		{
			label: 'Death',
			value: 'death',
			abilityDescription:
				'Death godlike seem to have an innate sense for the vulnerability of their enemies as death approaches. Against all targets with low Endurance, death godlike gain a bonus to damage.\nDeath godlike gain increased Power Level when they are Near Death.',
		},
		{
			label: 'Fire',
			value: 'fire',
			abilityDescription:
				"When fire godlike are reduced to low Endurance, their bodies harden, granting additional Damage Reduction, and their souls lash out at attackers, causing Burn damage to anyone who hits them in melee.\nFire godlike's skin is naturally resistant to Burn damage.",
		},
		{
			label: 'Nature',
			value: 'nature',
			abilityDescription:
				'The souls of nature godlike respond powerfully to Inspiration. While a nature godlike is under the effects of any Might, Constitution, or Dexterity Inspiration they benefit from an increased Power Level.',
		},
		{
			label: 'Moon',
			value: 'moon',
			abilityDescription:
				'The souls of all moon godlike are connected to reserves of healing energy. In combat, the first time a moon godlike is Hurt, Bloodied, or Near Death, they will automatically generate a wave of healing around themselves.',
		},
	],
};

const cultures: {
	value: CultureName;
	statChanges: Partial<Record<StatName, number>>;
}[] = [
	{
		value: 'aedyr',
		statChanges: { resolve: 1 },
	},
	{
		value: 'deadfire archipelago',
		statChanges: { dexterity: 1 },
	},
	{
		value: 'ixamitl plains',
		statChanges: { resolve: 1 },
	},
	{
		value: 'old valia',
		statChanges: { intellect: 1 },
	},
	{
		value: 'rautai',
		statChanges: { constitution: 1 },
	},
	{
		value: 'the living lands',
		statChanges: { might: 1 },
	},
	{
		value: 'the white that wends',
		statChanges: { perception: 1 },
	},
];

const subclasses: Record<ClassName, string[]> = {
	barbarian: ['berserker', 'corpse-eater', 'mage slayer', 'furyshaper'],
	chanter: ['beckoner', 'skald', 'troubadour', 'bellower', 'stormspeaker'],
	cipher: ['ascendant', 'beguiler', 'soul blade', 'psion', 'wild mind'],
	druid: ['fury', 'lifegiver', 'shifter', 'ancient', 'watershaper'],
	fighter: [],
	monk: [],
	paladin: [],
	priest: [],
	ranger: [],
	rogue: [],
	wizard: [],
};

export const load: PageLoad = ({ params }) => {
	return {
		races,
		subraces,
		cultures,
	};
};
