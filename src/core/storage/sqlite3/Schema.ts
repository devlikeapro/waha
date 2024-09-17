export class Field {
  constructor(
    public fieldName: string,
    public type: string,
  ) {}
}

export class Index {
  constructor(
    public name: string,
    public columns: string[],
  ) {}
}

export class Schema {
  constructor(
    public name: string,
    public columns: Field[],
    public indexes: Index[],
  ) {}
}
