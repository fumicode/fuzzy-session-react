import styled from "styled-components";
import ViewModel from "../00_Framework/00_ViewModel";
import Entity, { Id, StringId } from "../00_Framework/00_Entity";
import { Action } from "../00_Framework/00_Action";
import { useContext } from "react";
import { CharactorsContext } from "./30_GlobalStateContext";
export type RelationType = string;

export class CharactorId extends StringId {
  static fromString(str: string): CharactorId {
    return new CharactorId(str);
  }

  constructor(value: string | undefined = undefined) {
    super(value);
  }
}

export default class CharactorEntity implements Entity {
  constructor(
    readonly id: CharactorId,
    readonly name: string,
    readonly count: number,
    public relatedCharactors: CharactorRelation[], //一時的にmutableにしておく //TODO: ↑immutableにして変更メソッドを追加する
    readonly prev: CharactorEntity | undefined = undefined
  ) {}

  countUp(): CharactorEntity {
    return new CharactorEntity(
      this.id,
      this.name,
      this.count + 1,
      this.relatedCharactors,
      this
    );
  }

  countDown(): CharactorEntity {
    return new CharactorEntity(
      this.id,
      this.name,
      this.count - 1,
      this.relatedCharactors,
      this
    );
  }

  getView() {
    return CharactorView;
  }

  //ViewとModelの相互依存。 あとでどうにかする
  View = (props: Omit<CharactorViewModel, "main">) => {
    return <CharactorView {...props} main={this} />;
  };
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
  //あとで、contextを使って実装する
}

export const CharactorView = styled(
  ({
    className,
    main: charactor,
    colorHue,
    onRelationOpen,
  }: CharactorViewModel) => {
    const charactorsRepo = useContext(CharactorsContext);

    return (
      <article className={className}>
        <header className="e-header">
          <p className="e-type-id">Charactor #{charactor.id.toString()}</p>
          <h2 className="e-title">{charactor.name}</h2>
        </header>
        <div
          className="e-body"
          style={{ background: `hsl(${colorHue}, 50%, 50%)` }}
        >
          {charactor.relatedCharactors.map((relation) => {
            return (
              <div key={relation.targetId.toString()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); //これがないと親のonClickが呼ばれてしまう
                    onRelationOpen(relation);
                  }}
                >
                  {relation.relation}:{relation.targetName}
                </button>
              </div>
            );
          })}

          <p>
            <button
              onClick={() => {
                charactorsRepo?.dispatchOne(
                  charactor.id,
                  (chara: CharactorEntity) => {
                    return chara.countDown();
                  }
                );
              }}
            >
              -
            </button>
            {charactor.count}
            <button
              onClick={() => {
                charactorsRepo?.dispatchOne(
                  charactor.id,
                  (chara: CharactorEntity) => {
                    return chara.countUp();
                  }
                );
              }}
            >
              +
            </button>
          </p>
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
