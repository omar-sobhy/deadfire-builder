export interface GetAllOpts {
  ids: string[] | number[];
}

export interface GetOpts {
  id: string | number;
}

export interface PutOpts<O> {
  rows: { id: string | number; data: O }[];
}

export interface Model<O> {
  getAll(opts?: GetAllOpts): Promise<{ id: string; data: O }[]>;

  get(opts: GetOpts): Promise<{ id: string; data: O }>;

  put(opts: PutOpts<O>): Promise<unknown>;
}
