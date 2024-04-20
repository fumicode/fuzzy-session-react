import ViewModel from "../00_Framework/00_ViewModel";
import Entity, { StringId } from "../00_Framework/00_Entity";
import { FC } from "react";
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
    return componentList[0];
  }



  static registerView(component: FC<CharactorViewModel >){

    componentList.push (component);

  }
}

const componentList: FC<CharactorViewModel>[] = [];


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

export interface CharactorViewModel extends ViewModel<CharactorEntity> {
  colorHue: number;
  onRelationOpen?(cr: CharactorRelation): void;
  //あとで、contextを使って実装する
  onCountUp?():void;
  onCountDown?():void;
}
