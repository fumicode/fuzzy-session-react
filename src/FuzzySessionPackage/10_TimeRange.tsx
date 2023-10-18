import React, { FC } from "react";

import ViewModel from "../00_Framework/00_ViewModel";
import styled from "styled-components";
import FuzzyTime from "./10_FuzzyTime";
import TimeDiff from "./00_TimeDiff";

export default class TimeRange {
  readonly start: FuzzyTime;
  readonly end: FuzzyTime;

  constructor(start: string | FuzzyTime, end: string | FuzzyTime);

  constructor(start: string | FuzzyTime, end: string | FuzzyTime) {
    if (typeof start === "string") {
      start = new FuzzyTime(start);
    }
    if (typeof end === "string") {
      end = new FuzzyTime(end);
    }

    if (!(start.compare(end) < 0)) {
      throw new Error(
        `開始時刻は終了時刻よりも前である必要があります。 start: ${start.toString()}, end: ${end.toString()}`
      );
    }

    this.start = start;
    this.end = end;
  }

  tryChangeStartTime(diff: FuzzyTime | TimeDiff): TimeRange | string {
    try {
      return this.changeStartTime(diff);
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      } else {
        throw e;
      }
    }
  }
  changeStartTime(diff: FuzzyTime | TimeDiff): TimeRange {
    if (diff instanceof FuzzyTime) {
      const start = diff;
      return new TimeRange(start, this.end);
    } else if (diff instanceof TimeDiff) {
      return new TimeRange(this.start.change(diff), this.end);
    } else {
      throw new Error("diff must be FuzzyTime or TimeDiff");
    }
  }

  get startHour(): number {
    return this.start.hour + this.start.minute / 60;
  }

  get endHour(): number {
    return this.end.hour + this.end.minute / 60;
  }

  get durationHour(): number {
    const startDate = new Date(`2023-08-22T${this.start.toString()}`);
    const endDate = new Date(`2023-08-22T${this.end.toString()}`);

    //TODO: 簡易的な計算!!!! いずれ、date-fnsなどのlibを使って厳密に計算したい。
    const duration =
      endDate.getHours() +
      endDate.getMinutes() / 60 -
      (startDate.getHours() + startDate.getMinutes() / 60);

    return duration;
  }

  overlaps(otherTR: TimeRange): TimeRange | undefined {
    if (!overlaps(this, otherTR)) {
      return undefined;
    } else {
      const start =
        this.startHour > otherTR.startHour ? this.start : otherTR.start;

      const end = this.endHour < otherTR.endHour ? this.end : otherTR.end;

      return new TimeRange(start, end);
    }
  }

  compare(otherTR: TimeRange): number {
    return compare(this, otherTR);
  }

  toString(): string {
    return `${this.start}〜${this.end}`;
  }
}

const overlaps = (a: TimeRange, b: TimeRange): boolean => {
  return !(a.end <= b.start || b.end <= a.start);
};

const compare = (a: TimeRange, b: TimeRange): number => {
  if (a.startHour < b.startHour) {
    return -1; // < 0
  } else if (a.startHour > b.startHour) {
    return 1; // > 0
  } else {
    if (a.endHour < b.endHour) {
      return 1; // > 0
    } else if (a.endHour > b.endHour) {
      return -1; // < 0
    }

    return 0;
  }
};

export type TimeRangeViewModel = ViewModel<TimeRange> & {
  children?: React.ReactNode;
  background?: string;
  hourPx?: number;
};

export const TimeRangeTextView: FC<TimeRangeViewModel> = ({
  main: range,
}: TimeRangeViewModel) => {
  return (
    <>
      {range.start.toString()} 〜 {range.end.toString()}
    </>
  );
};

export const TimeRangeView: FC<TimeRangeViewModel> = styled(
  ({
    className,
    main: range,
    background,
    hourPx,
    children,
  }: TimeRangeViewModel) => {
    const hoursNum = range.durationHour;
    hourPx = hourPx || 50;

    return (
      <div
        className={className}
        style={{
          height: `${hoursNum * hourPx}px`,
          background: background || "hsl(0, 100%, 70%)",
        }}
      >
        <div className="e-content">{children}</div>
        <div className="e-time-range-wrappers">
          <div className="e-time-range-wrapper m-start">
            <div className="e-time-range">{range.start.toString()}〜</div>
          </div>
          <div className="e-time-range-wrapper m-end">
            <div className="e-time-range">〜{range.end.toString()}</div>
          </div>
        </div>
      </div>
    );
  }
)`
  position: relative;

  height: 200px; //とりあえず仮で

  border: 1px solid white;

  //background: hsl(0, 100%, 70%);

  &:hover {
    > .e-time-range-wrapper > .e-time-range {
      max-height: 100px;
      padding: 3px; //TODO: ここにこれ書くの汚い
    }
  }

  > .e-content {
    position: relative;
    height: 100%;
    width: 100%;
  }

  > .e-time-range-wrappers {
    > .e-time-range-wrapper {
      position: absolute;
      left: 0;
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
  }
`;
