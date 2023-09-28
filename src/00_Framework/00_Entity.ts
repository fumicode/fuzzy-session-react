import crypto from "crypto";

export interface Id {
  equals(other: Id): boolean;
}

export default interface Entity {
  readonly id: Id;
  readonly prev: Entity | undefined;
}

export class StringId implements Id {
  private readonly _value: string;

  constructor(value: string | undefined = undefined) {
    if (value === undefined) {
      //TODO: なぜかcrypto.randomUUIDが使えないので、簡易的なやりかた
      value = crypto.randomBytes(20).toString("hex");
    }
    this._value = value;
  }
  toString(mode: string | undefined = undefined): string {
    if (mode === "short") {
      return this._value.substring(0, 8);
    }
    return this._value;
  }
  equals(otherId: StringId): boolean {
    if (!(otherId instanceof StringId)) {
      throw new Error("同じ型のIDでないとくらべられません");
    }
    return this._value === otherId._value;
  }
}
