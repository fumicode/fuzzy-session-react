import crypto from "crypto";

export interface Id {
  equals(other: this): boolean;
}

export default interface Entity {
  readonly id: Id;
  readonly prev: Entity | undefined;
}

export const convertIterableEntityToMap = <T extends Entity>(
  entities: Iterable<T>
): Map<string, T> => {
  const map = new Map<string, T>();
  for (const entity of entities) {
    map.set(entity.id.toString(), entity);
  }
  return map;
};

export const convertIterableEntityToIdSet = <T extends Entity>(
  entities: Iterable<T>
): Set<string> => {
  const set = new Set<string>();
  for (const entity of entities) {
    set.add(entity.id.toString());
  }
  return set;
};

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
  equals(otherId: this): boolean {
    if (
      !(
        otherId instanceof this.constructor &&
        this instanceof otherId.constructor
      )
    ) {
      return false;
    }
    return this._value === otherId._value;
  }
}
