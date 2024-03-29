import Entity, { StringId } from "../00_Framework/00_Entity";

export class UserId extends StringId {}

export interface UserSpec {
  readonly name: string;
}

export default class UserEntity implements Entity {
  readonly id: UserId;
  readonly name: string;
  readonly prev: UserEntity | undefined;

  constructor(
    id: UserId | string,
    { name }: UserSpec,
    prev: UserEntity | undefined
  ) {
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
