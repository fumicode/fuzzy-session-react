import { FC } from "react";
import styled from "styled-components";

import ViewModel from "./00_ViewModel";

import TimeRange, { TimeRangeTextView } from "./10_TimeRange";
import crypto from "crypto";
import { TimeDiff } from "./10_FuzzyTime";

import classNames from "classnames";

export class SessionId {
  private readonly _value: string;

  static fromString(str: string): SessionId {
    return new SessionId(str);
  }

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

  equals(otherId: SessionId): boolean {
    return this._value === otherId._value;
  }
}

export default class SessionEntity {
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
}

const ThisClass = SessionEntity;

export type SessionFuture = (s:SessionEntity)=>SessionEntity;


export interface SessionViewModel extends ViewModel<SessionEntity> {
  //className,
  //main

  hourPx: number;

  onStartTimeChange: (sessionFuture: SessionFuture) => void;

  onEndTimeChange: (sessionFuture: SessionFuture) => void;

  onDragStart: (startY: number) => void;
  onDragEnd: (hourDiff: number) => void;

  isHovered: boolean;
}

export const SessionView: FC<SessionViewModel> = styled(
  ({
    className: c,
    main: session,

    hourPx,

    onStartTimeChange,

    onEndTimeChange,


    onDragStart,
    onDragEnd,

    isHovered,
  }: SessionViewModel) => {
    const timeRange = session.timeRange;
    const hoursNum = timeRange.durationHour;

    return (
      <section
        className={c + " " + (isHovered && "m-hover")}
        style={{ height: `${hoursNum * hourPx}px` }}
      >
        {/*
      <div style={{fontSize:'13px'}}>
        #{session.id.toString('short')}
      </div>
      */}
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
              onClick={(e) => {
                onStartTimeChange((session)=>{
                  return session.changeStartTime(new TimeDiff(-1, 1, 0));
                });
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              onClick={(e) => {
                onStartTimeChange((session)=>{
                  return session.changeStartTime(new TimeDiff(1, 1, 0));
                });
              }}
            >
             ▼ 
            </button>

          </div>
          <div className="e-control-buttons m-end">

            <button
              className="e-button m-up"
              onClick={(e) => {
                onEndTimeChange((session)=>{
                  return session.changeEndTime(new TimeDiff(-1, 1, 0));
                });
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              onClick={(e) => {
                onEndTimeChange((session)=>{
                  return session.changeEndTime(new TimeDiff(1, 1, 0));
                });
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
