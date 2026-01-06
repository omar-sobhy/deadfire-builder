import type { AbilityWeaponType } from "../../../types/enums/ability-weapon-type.js";
import type { AttackRangeCategory } from "../../../types/enums/attack-range-category.js";
import type { AbilityDto } from "./ability.dto.js";

export interface WeaponAttackAbilityDto extends AbilityDto {
    type: AbilityWeaponType;
    range: AttackRangeCategory;
    
}