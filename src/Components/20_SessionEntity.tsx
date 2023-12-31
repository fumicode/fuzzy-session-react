import { FC } from "react";
import styled from "styled-components";

import ViewModel from "./../00_Framework/00_ViewModel";

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
  equals(otherId: SessionId): boolean {
    if (!(otherId instanceof SessionId)) {
      throw new Error("同じ型のIDでないとくらべられません");
    }

    return super.equals(otherId);
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
    );
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
    return nextState as this;
  }
}

const ThisClass = SessionEntity;

export type SessionAction = Action<SessionEntity>;

export interface SessionViewModel extends ViewModel<SessionEntity> {
  //className,
  //main

  hourPx: number;

  onStartTimeChange: (sessionAction: SessionAction) => void;
  onEndTimeChange: (sessionAction: SessionAction) => void;
  onDragStart: (startY: number) => void;

  isHovered: boolean;
}

export const startTimeBackAction: SessionAction = (session: SessionEntity) =>
  session.changeTimeRange(new TimeDiff("-", 0, 15));

export const startTimeGoAction: SessionAction = (session: SessionEntity) =>
  session.changeTimeRange(new TimeDiff("+", 0, 15));

export const endTimeBackAction: SessionAction = (session: SessionEntity) =>
  session.changeEndTime(new TimeDiff("-", 0, 15));

export const endTimeGoAction: SessionAction = (session: SessionEntity) =>
  session.changeEndTime(new TimeDiff("+", 0, 15));

export const SessionView: FC<SessionViewModel> = styled(
  ({
    className: c,
    main: session,

    hourPx,

    onStartTimeChange,
    onEndTimeChange,
    onDragStart,

    isHovered,
  }: SessionViewModel) => {
    const timeRange = session.timeRange;
    const hoursNum = timeRange.durationHour;

    return (
      <section
        className={c + " " + (isHovered && "m-hover")}
        style={{ height: `${hoursNum * hourPx}px` }}
      >
        {/* <div style={{fontSize:'13px'}}> 
        #{session.id.toString('short')} </div> */}
        <div style={{ fontSize: "13px" }}>{session.title}</div>
        <div style={{ fontSize: "10px" }}>
          <TimeRangeTextView main={timeRange} />
        </div>
        <div className="e-time-range-wrapper m-start">
          <div className="e-time-range">
            {session.timeRange.start.toString()}〜
          </div>
        </div>
        <div className="e-time-range-wrapper m-end">
          <div className="e-time-range">
            〜{session.timeRange.end.toString()}
          </div>
        </div>
        <div className="e-fuzzy-box m-start"></div>
        <div className="e-fuzzy-box m-end"></div>

        <div className="e-time-range-controller">
          <div
            className={classNames("e-drag-area", {
              "m-dragging": /*isDragging*/ false,
            })}
            onMouseDown={(e) => {
              const y = e.clientY;
              onDragStart(y);
            }}
          ></div>
          <div className="e-control-buttons m-start">
            <button
              className="e-button m-up"
              disabled={!peekIntoFuture(session, startTimeBackAction)}
              onClick={() => {
                onStartTimeChange(startTimeBackAction);
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              disabled={!peekIntoFuture(session, startTimeGoAction)}
              onClick={() => {
                onStartTimeChange(startTimeGoAction);
              }}
            >
              ▼
            </button>
          </div>
          <div className="e-control-buttons m-end">
            <button
              className="e-button m-up"
              disabled={!peekIntoFuture(session, endTimeBackAction)}
              onClick={() => {
                onEndTimeChange(endTimeBackAction);
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              disabled={!peekIntoFuture(session, endTimeGoAction)}
              onClick={() => {
                onEndTimeChange(endTimeGoAction);
              }}
            >
              ▼
            </button>
          </div>
        </div>
      </section>
    );
  }
)`
  position: relative;

  width: 100px;
  height: 200px; //とりあえず仮で

  border: 1px solid white;

  background: hsla(280, 50%, 54%, 0.8);

  color: white;

  &:hover,
  &.m-hover {
    > .e-time-range-wrapper {
      > .e-time-range {
        max-height: 100px;
        padding: 3px; //TODO: ここにこれ書くの汚い

        color: black;
      }
    }

    > .e-time-range-controller {
      display: block;
    }
  }

  > .e-time-range-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

    &.m-start {
      position: absolute;
      top: 0;

      > .e-time-range {
        bottom: 0;

        border-radius: 5px 5px 0 0;
      }
    }

    &.m-end {
      position: absolute;
      bottom: 0;

      > .e-time-range {
        top: 0;

        border-radius: 0 0 5px 5px;
      }
    }

    > .e-time-range {
      position: absolute;
      left: 0;
      box-sizing: border-box;

      max-height: 0;
      padding: 0; //TODO: ここにこれ書くの汚い

      overflow: hidden;

      padding-right: 10px;
      line-height: 1;

      font-size: 10px;

      background-color: #ddd;

      white-space: nowrap;
    }
  }

  > .e-time-range-controller {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;

    width: 1em;

    > .e-drag-area {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      user-select: none;

      cursor: grab; //grabbingにもかわる

      &.m-dragging {
        cursor: grabbing;
        background: #ccc;
      }

      //真ん中に配置
      display: flex;
      align-items: center;
      justify-content: center;

      background: #ddd;
      line-height: 1;

      &::before {
        content: "三三";
      }
    }

    > .e-control-buttons {
      position: absolute;
      right: 0;
      width: 0;

      &.m-start {
        top: 0;
      }
      &.m-end {
        bottom: 0;
      }

      > .e-button {
        position: absolute;

        &.m-up {
          bottom: 0;
        }
        &.m-down {
          top: 0;
        }
      }
    }
  }

  > .e-fuzzy-box {
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;

    pointer-events: none;

    height: 50px;

    //background: radial-gradient(hsla(280, 50%, 54%, 1), transparent);
    background: linear-gradient(
      hsla(252, 50%, 54%, 0.2),
      hsla(252, 50%, 54%, 0.8),
      hsla(252, 50%, 54%, 0.2)
    );

    border-radius: 5px;

    &.m-start {
      top: 0;
      margin-top: -25px;
    }

    &.m-end {
      bottom: 0;
      margin-bottom: -25px;
    }
  }
`;
