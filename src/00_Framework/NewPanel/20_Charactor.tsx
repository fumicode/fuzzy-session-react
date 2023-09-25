import { Point2, Size2 } from "../../01_Utils/00_Point";
export type RelationType = "friend" | "brother" | "trusting";

export class CharactorRelation {
  constructor(readonly target: Charactor, readonly relation: RelationType) {}
}
export type CharactorId = string;
export default class Charactor {
  constructor(
    readonly id: CharactorId,
    readonly name: string,
    public relatedCharactors: CharactorRelation[], //一時的にmutableにしておく
    readonly position: Point2,
    readonly size: Size2
  ) {}

  moveTo(newPosition: Point2): Charactor {
    return new Charactor(
      this.id,
      this.name,
      this.relatedCharactors,
      newPosition,
      this.size
    );
  }
}
