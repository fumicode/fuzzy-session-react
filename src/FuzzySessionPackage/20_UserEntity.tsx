import Entity, { StringId } from "../00_Framework/00_Entity";

export class UserId extends StringId {}

export interface UserSpec {
  readonly name: string;
}

export class User implements Entity {
  readonly name: string;
  readonly id: UserId;
  readonly prev: User | undefined;

  constructor(id: UserId | string, { name }: UserSpec, prev: User | undefined) {
    if (id instanceof UserId) {
      this.id = id;
    } else if (typeof id === "string") {
      this.id = new UserId(id);
    } else {
      throw new Error("idの型がおかしいです。");
    }

    this.name = name;

    this.prev = prev;
  }
}
