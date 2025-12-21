export class CultureDto {
  public constructor(
    public readonly id: string,
    public readonly resolve: number,
    public readonly might: number,
    public readonly dexterity: number,
    public readonly constitution: number,
    public readonly intellect: number,
    public readonly perception: number,
    public readonly displayName?: string,
  ) {}
}
