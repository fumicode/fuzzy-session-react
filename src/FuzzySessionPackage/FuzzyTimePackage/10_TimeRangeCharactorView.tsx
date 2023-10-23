import React, { FC } from "react";

import ViewModel from "../../00_Framework/00_ViewModel";
import styled from "styled-components";
import FuzzyTime from "./10_FuzzyTime";
import TimeDiff from "./00_TimeDiff";
import TimeRange from "./10_TimeRange";
import { Action, peekIntoFuture } from "../../00_Framework/00_Action";

export type TimeRangeCharactorViewModel = ViewModel<TimeRange> & {
  dispatchAction: (action: TimeRangeAction) => void;
};

type TimeRangeAction = Action<TimeRange>;

export const startTimeChangeActionCreator =
  (timeDiff: TimeDiff) => (timeRange: TimeRange) => {
    return timeRange.move(timeDiff);
  };

export const endTimeChangeActionCreator =
  (timeDiff: TimeDiff) => (timeRange: TimeRange) => {
    return timeRange.changeEndTime(timeDiff);
  };

export const TimeRangeCharactorView: FC<TimeRangeCharactorViewModel> = styled(
  ({
    className,
    main: range,

    dispatchAction: dispatchTimeRangeAction,
  }: TimeRangeCharactorViewModel) => {
    const startTimeBackAction = startTimeChangeActionCreator(
      new TimeDiff("-", 0, 15)
    );
    const startTimeGoAction = startTimeChangeActionCreator(
      new TimeDiff("+", 0, 15)
    );

    const endTimeBackAction = endTimeChangeActionCreator(
      new TimeDiff("-", 0, 15)
    );
    const endTimeGoAction = endTimeChangeActionCreator(
      new TimeDiff("+", 0, 15)
    );

    return (
      <div className={className}>
        <div className="e-edge m-start">
          {range.start.toString()}〜
          <div>
            <button
              disabled={!peekIntoFuture(range, startTimeBackAction)}
              onClick={() => {
                dispatchTimeRangeAction(startTimeBackAction);
              }}
            >
              ◀
            </button>
            <button
              disabled={!peekIntoFuture(range, startTimeGoAction)}
              onClick={() => {
                dispatchTimeRangeAction(startTimeGoAction);
              }}
            >
              ▶
            </button>
          </div>
        </div>
        <div className="e-interval">◀{range.formatDuration()}▶</div>
        <div className="e-edge m-end">
          〜{range.end.toString()}
          <div>
            <button
              disabled={!peekIntoFuture(range, endTimeBackAction)}
              onClick={() => {
                dispatchTimeRangeAction(endTimeBackAction);
              }}
            >
              ◀
            </button>
            <button
              disabled={!peekIntoFuture(range, endTimeGoAction)}
              onClick={() => {
                dispatchTimeRangeAction(endTimeGoAction);
              }}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  }
)`
  display: flex;

  .e-edge {
    flex-grow: 0;

    display: inline-block;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin: 0 4px;

    &.m-start {
    }
    &.m-end {
    }
  }

  .e-interval {
    flex-grow: 1;
    background-color: #f0f0f0;
    border-radius: 4px;

    text-align: center;
    margin: 0 4px;
  }
`;
