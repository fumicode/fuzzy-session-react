import { FuzzyTime, TimeDiff, TimeRange } from "./FuzzyTimePackage/index";

import { Action } from "../00_Framework/00_Action";
import Entity, { StringId } from "../00_Framework/00_Entity";

export class SessionId extends StringId {
  static fromString(str: string): SessionId {
    return new SessionId(str);
  }

  constructor(value: string | undefined = undefined) {
    super(value);
  }
}

export class User {
  constructor(readonly id: string, readonly name: string) {}
}

export default class SessionEntity implements Entity {
  readonly id: SessionId;
  constructor(
    id: SessionId | undefined,
    readonly title: string,
    readonly timeRange: TimeRange,
    readonly prev: SessionEntity | undefined = undefined
  ) {
    if (!id) {
      id = new SessionId();
    }

    this.id = id;
  }

  overlaps(otherSession: SessionEntity): TimeRange | undefined {
    return this.timeRange.overlaps(otherSession.timeRange);
  }

  changeStartTime(diff: TimeDiff): this {
    return new ThisClass(
      this.id,
      this.title,
      new TimeRange(this.timeRange.start.change(diff), this.timeRange.end),
      this
    ) as this;
  }

  changeEndTime(diff: TimeDiff): this {
    return new ThisClass(
      this.id,
      this.title,
      new TimeRange(this.timeRange.start, this.timeRange.end.change(diff)),
      this
    ) as this;
  }

  changeTimeRange(diff: TimeDiff): this {
    const newSession = new ThisClass(
      this.id,
      this.title,
      new TimeRange(
        this.timeRange.start.change(diff),
        this.timeRange.end.change(diff)
      ),
      this
    ) as this;

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
}

const ThisClass = SessionEntity;

export type SessionAction = Action<SessionEntity>;
