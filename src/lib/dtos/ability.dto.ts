export class AbilityDto {
  public constructor(
    public readonly id: string,
    public readonly debugName: string,
    public readonly icon: string,
    public readonly displayName?: string,
    public readonly description?: string,
  ) {}
}
