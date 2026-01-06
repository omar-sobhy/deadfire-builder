export enum StatusEffectChildUsageType {
  /**
   * Status effect value only used by special status effects
   */
  None = 'None',

  /**
   * Status effect value applied to caster and cleared when parent effect
   * is clearned
   */
  Transfer = 'Transfer',

  /**
   * Status effect value applied to target and cleared when parent effect
   * is cleared
   */
  Child = 'Child',

  /**
   * Status effect value applied to target when effect is "triggered", and
   * removed when effect is "untriggered"
   */
  TriggeredChild = 'TriggeredChild',
}
