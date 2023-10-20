import { FuzzyTime, TimeDiff, TimeRange } from "./FuzzyTimePackage/index";

import { Action } from "../00_Framework/00_Action";
import Entity, {
  StringId,
  convertIdentifiablesToIdSet,
  convertIdentifiablesToMap,
} from "../00_Framework/00_Entity";
import { Session } from "inspector";
import { UserEntity } from "./20_UserEntity";

export class SessionId extends StringId {
  static fromString(str: string): SessionId {
    return new SessionId(str);
  }

  constructor(value: string | undefined = undefined) {
    super(value);
  }
}

//Specとは、完全にオブジェクトの状態を再現できる情報のあつまりのこと。
interface SessionSpec {
  readonly title: string;
  readonly timeRange: TimeRange;
  readonly members?: UserEntity[] | Set<string>;
}

export default class SessionEntity implements Entity {
  readonly id: SessionId;

  readonly title: string;
  readonly timeRange: TimeRange;
  readonly members: Set<string> | undefined;

  constructor(
    id: SessionId | undefined, //TODO: 文字列も許容したい。あとで。
    { title, timeRange, members }: SessionSpec,
    readonly prev: SessionEntity | undefined = undefined
  ) {
    if (!id) {
      id = new SessionId();
    }

    this.id = id;

    this.title = title;
    this.timeRange = timeRange;

    if (members instanceof Set) {
      this.members = members;
    } else if (members instanceof Array) {
      this.members = convertIdentifiablesToIdSet(members);
    } else if (members === undefined) {
      this.members = undefined;
    } else {
      throw new Error("membersの型がおかしいです。");
    }

    if (!this.timeRange) {
      throw new Error("time range がありません。");
    }
  }

  overlaps(otherSession: this): TimeRange | undefined {
    return this.timeRange.overlaps(otherSession.timeRange);
  }

  changeStartTime(diff: TimeDiff): this {
    return this.update({
      timeRange: new TimeRange(
        this.timeRange.start.change(diff),
        this.timeRange.end
      ),
    });
  }

  changeEndTime(diff: TimeDiff): this {
    return this.update({
      timeRange: new TimeRange(
        this.timeRange.start,
        this.timeRange.end.change(diff)
      ),
    });
  }

  changeTimeRange(diff: TimeDiff): this {
    const newSession = this.update({
      timeRange: new TimeRange(
        this.timeRange.start.change(diff),
        this.timeRange.end.change(diff)
      ),
    });

    //最終的にはいらなくなるはずのチェック。今は、時間が循環するから必要になってる。
    this.checkChangeDirection(
      diff,
      this.timeRange.start,
      newSession.timeRange.start
    );
    return newSession;
  }

  //動かそうとした方向と、実際に変化した方向が同じかどうかをチェックする。
  private checkChangeDirection(
    diff: TimeDiff,
    prev: FuzzyTime,
    next: FuzzyTime
  ): void {
    //diffの向きに変化した場合のみ、変更する。
    //=diffと違う向きに変化したら、例外を投げる。
    //未来に向かう方向が+
    const sign: number = diff.signedOne;

    //compare: 0: 同じ, 1: 未来, -1: 過去
    const diffDirection = prev.compare(next) * -1;

    //掛けてマイナスなら、diffDirectionとsignは違う向き。
    //意図した方向と結果が違っていることになる。
    if (diffDirection * sign < 0) {
      throw new Error(
        `changeTimeRange: 変化しようとした方向は ${diff.sign} でしたが、開始時間が逆方向にうごきました。`
      );
    }
  }

  update(changingContent: Partial<SessionSpec>): this {
    return new ThisClass(
      this.id,
      Object.assign(this.exportSpec(), changingContent),
      this
    ) as this;
  }
  exportSpec(): SessionSpec {
    return {
      title: this.title,
      timeRange: this.timeRange,
      members: this.members,
    };
  }
}

const ThisClass = SessionEntity;

export type SessionAction = Action<SessionEntity>;
