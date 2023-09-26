import styled from "styled-components";
import { Point2, Size2 } from "../../01_Utils/00_Point";
import ViewModel from "../00_ViewModel";
export type RelationType = "friend" | "brother" | "trusting";

export class CharactorRelation {
  constructor(
    readonly target: CharactorEntity,
    readonly relation: RelationType
  ) {}
}
export type CharactorId = string;
export default class CharactorEntity {
  constructor(
    readonly id: CharactorId,
    readonly name: string,
    public relatedCharactors: CharactorRelation[], //一時的にmutableにしておく

    //ここから下はviewに対する情報
    readonly position: Point2,
    readonly size: Size2
  ) {}

  moveTo(newPosition: Point2): CharactorEntity {
    return new CharactorEntity(
      this.id,
      this.name,
      this.relatedCharactors,

      newPosition,
      this.size
    );
  }
}

interface CharactorViewModel extends ViewModel<CharactorEntity> {
  colorHue: number;

  onRelationOpen(cr: CharactorRelation): void;
}

export const CharactorView = styled(
  ({
    className,
    main: charactor,
    colorHue,
    onRelationOpen,
  }: CharactorViewModel) => {
    return (
      <article className={className}>
        <header className="e-header">
          <p>Charactor #{charactor.id}</p>
          <h2 className="e-title">{charactor.name}</h2>
        </header>
        <div
          className="e-body"
          style={{ background: `hsl(${colorHue}, 50%, 50%)` }}
        >
          {charactor.relatedCharactors.map((relation) => {
            return (
              <button
                onClick={() => {
                  onRelationOpen(relation);
                }}
                key={relation.target.id}
              >
                {relation.relation}:{relation.target.name}
              </button>
            );
          })}
        </div>
      </article>
    );
  }
)`
  display: flex;
  flex-direction: column;
  > .e-header {
    //flex-basis: 0;
    flex-grow: 0;
    flex-shrink: 0;

    cursor: move;
    //選択させない
    user-select: none;

    > .e-title {
      margin: 0;
      padding: 0;
      line-height: 1;
    }
  }

  > .e-body {
    //flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;

    overflow: scroll;
    transition: background 0.9s;
  }
  display: contents;
`;
