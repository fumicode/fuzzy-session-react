import { FC } from "react";
import styled from "styled-components";

import ViewModel from "../00_Framework/00_ViewModel";

import { TimeRangeTextView, TimeDiff } from "./FuzzyTimePackage/index";

import classNames from "classnames";
import { peekIntoFuture } from "../00_Framework/00_Action";
import SessionEntity, { SessionAction } from "./20_SessionEntity";

export interface SessionViewModel extends ViewModel<SessionEntity> {
  //className,
  //main

  hourPx: number;

  dispatchAction: (sessionAction: SessionAction) => void;
  onDragStart: (startY: number) => void;

  onDoubleClick?: (e: React.MouseEvent) => void;
  onDetailOpen?: (e: React.MouseEvent) => void;

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

    dispatchAction,

    onDragStart,
    onDoubleClick,
    onDetailOpen,

    isHovered,
  }: SessionViewModel) => {
    const timeRange = session.timeRange;
    const hoursNum = timeRange.durationHour;

    return (
      <section
        className={c + " " + (isHovered && "m-hover")}
        style={{ height: `${hoursNum * hourPx}px` }}
        onDoubleClick={(e) => {
          onDoubleClick && onDoubleClick(e);
        }}
      >
        {/* <div style={{fontSize:'13px'}}> 
        #{session.id.toString('short')} </div> */}
        <div style={{ fontSize: "13px" }}>{session.title}</div>
        <div style={{ fontSize: "10px" }}>
          <TimeRangeTextView main={timeRange} />
        </div>
        <div style={{ fontSize: "10px" }}>
          {/*

          <button
            onClick={(e) => {
              onDetailOpen && onDetailOpen(e);
            }}
          >
            開く
          </button>
          */}
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
                dispatchAction(startTimeBackAction);
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              disabled={!peekIntoFuture(session, startTimeGoAction)}
              onClick={() => {
                dispatchAction(startTimeGoAction);
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
                dispatchAction(endTimeBackAction);
              }}
            >
              ▲
            </button>
            <button
              className="e-button m-down"
              disabled={!peekIntoFuture(session, endTimeGoAction)}
              onClick={() => {
                dispatchAction(endTimeGoAction);
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
