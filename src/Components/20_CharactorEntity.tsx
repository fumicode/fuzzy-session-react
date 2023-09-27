import styled from "styled-components";
import { Point2, Size2 } from "../01_Utils/00_Point";
import ViewModel from "../00_Framework/00_ViewModel";
export type RelationType = string;

export type CharactorId = string;
export default class CharactorEntity {
  constructor(
    readonly id: CharactorId,
    readonly name: string,
    public relatedCharactors: CharactorRelation[] //一時的にmutableにしておく //TODO: ↑immutableにして変更メソッドを追加する
  ) {}
}

export class CharactorRelation {
  private _targetCharactorId: CharactorId;
  private _targetCharactorName: string;

  constructor(target: CharactorEntity, readonly relation: RelationType) {
    this._targetCharactorId = target.id;
    this._targetCharactorName = target.name;
  }

  get targetId(): CharactorId {
    return this._targetCharactorId;
  }
  get targetName(): string {
    return this._targetCharactorName;
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
          <p className="e-type-id">Charactor #{charactor.id}</p>
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
                key={relation.targetId}
              >
                {relation.relation}:{relation.targetName}
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
    padding: 5px;
    //flex-basis: 0;
    flex-grow: 0;
    flex-shrink: 0;

    background: white;
    cursor: move;
    //選択させない
    user-select: none;

    > .e-type-id {
      margin: 0;
      padding: 0;
      line-height: 1;
      font-size: 0.8em;
    }

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

    padding: 5px;

    overflow: scroll;
    transition: background 0.9s;
  }
  display: contents;
`;
