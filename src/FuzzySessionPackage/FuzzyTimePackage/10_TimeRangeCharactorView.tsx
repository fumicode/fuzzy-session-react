import React, { FC, ReactNode } from "react";

import ViewModel from "../../00_Framework/00_ViewModel";
import styled from "styled-components";
import FuzzyTime from "./10_FuzzyTime";
import TimeDiff from "./00_TimeDiff";
import TimeRange from "./10_TimeRange";
import {
  Action,
  calcErrorReason,
  peekIntoFuture,
} from "../../00_Framework/00_Action";

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
          <div className="e-other-options">
            <div className="e-option-box m-top">
              <ErrorBlockButton<TimeRange>
                className="e-option-button "
                main={range}
                action={startTimeBackAction}
                dispatchAction={dispatchTimeRangeAction}
              >
                ▲
              </ErrorBlockButton>
            </div>
            <div className="e-option-box m-bottom">
              <ErrorBlockButton<TimeRange>
                className="e-option-button "
                main={range}
                action={startTimeGoAction}
                dispatchAction={dispatchTimeRangeAction}
              >
                ▼
              </ErrorBlockButton>
            </div>
          </div>
        </div>
        <div className="e-interval">◀{range.formatDuration()}▶</div>

        <div className="e-edge m-end">
          〜{range.end.toString()}
          <div className="e-other-options">
            <div className="e-option-box m-top">
              <ErrorBlockButton<TimeRange>
                className="e-option-button "
                main={range}
                action={endTimeBackAction}
                dispatchAction={dispatchTimeRangeAction}
              >
                ▲
              </ErrorBlockButton>
            </div>
            <div className="e-option-box m-bottom">
              <ErrorBlockButton<TimeRange>
                className="e-option-button"
                main={range}
                action={endTimeGoAction}
                dispatchAction={dispatchTimeRangeAction}
              >
                ▼
              </ErrorBlockButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
)`
  display: flex;

  > .e-edge {
    flex-grow: 0;

    display: inline-block;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin: 0 4px;

    position: relative;

    &.m-start {
    }
    &.m-end {
    }

    &:hover {
      > .e-other-options {
        display: block;
      }
    }

    > .e-other-options {
      display: none;

      &.m-shown {
        display: block;
      }

      > .e-option-box {
        position: absolute;
        left: 0;
        right: 0;
        height: 0;

        &.m-top {
          top: 0;
          > .e-option-button {
            bottom: 0;
          }
        }
        &.m-bottom {
          bottom: 0;
          > .e-option-button {
            top: 0;
          }
        }

        > .e-option-button {
          display: block;

          position: absolute;
          left: 0;

          border: 0;
          width: 100%;

          white-space: nowrap;
          background: transparent;

          cursor: pointer;
        }
      }

      &:hover > .e-other-options {
        display: block;
      }
    }
  }

  > .e-interval {
    flex-grow: 1;
    background-color: #f0f0f0;
    border-radius: 4px;

    text-align: center;
    margin: 0 4px;
  }
`;

interface ErrorBlockButtonProps<T> {
  readonly className: string;
  readonly main: T;
  readonly action: Action<T>;
  readonly dispatchAction: (action: Action<T>) => void;
  readonly children: ReactNode;
}

const ErrorBlockButton = <T,>({
  className,
  main,
  action,
  dispatchAction,
  children,
}: ErrorBlockButtonProps<T>) => {
  const willBeError = !peekIntoFuture(main, action);
  const error = calcErrorReason(main, action);

  return (
    <button
      className={className}
      disabled={willBeError}
      onClick={() => {
        dispatchAction(action);
      }}
    >
      {children}
    </button>
  );
};
