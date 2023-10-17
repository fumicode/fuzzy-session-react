import { FC } from "react";
import styled from "styled-components";

import ViewModel from "../00_Framework/00_ViewModel";

import TimeRange, { TimeRangeTextView } from "./10_TimeRange";
import crypto from "crypto";
import { TimeDiff } from "./10_FuzzyTime";

import classNames from "classnames";
import { Action, peekIntoFuture } from "../00_Framework/00_Action";
import Entity, { StringId } from "../00_Framework/00_Entity";

export class SessionId extends StringId {
  static fromString(str: string): SessionId {
    return new SessionId(str);
  }

  constructor(value: string | undefined = undefined) {
    super(value);
  }
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
    const nextState = new ThisClass(
      this.id,
      this.title,
      new TimeRange(
        this.timeRange.start.change(diff),
        this.timeRange.end.change(diff)
      ),
      this
    ) as this;
    //diffの向きに変化した場合のみ、変更する。
    //=diffと違う向きに変化したら、例外を投げる。
    const sign: number = parseInt(diff.sign + "1");
    const diffDirection =
      this.timeRange.start.compare(nextState.timeRange.start) * -1;
    if (diffDirection * sign < 0) {
      throw new Error(
        `changeTimeRange: diff.sign === ${diff.sign}, but start time has changed to different direction`
      );
    }
    return nextState;
  }
}

const ThisClass = SessionEntity;

export type SessionAction = Action<SessionEntity>;
