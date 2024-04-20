import { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";

import ViewModel from "../00_Framework/00_ViewModel";

import { TimeRangeTextView, TimeDiff } from "./FuzzyTimePackage/index";

import classNames from "classnames";
import { peekIntoFuture } from "../00_Framework/00_Action";
import SessionEntity, { SessionAction } from "./20_SessionEntity";
import UserEntity from "./20_UserEntity";
import { TimeRangeCharactorView } from "./FuzzyTimePackage/10_TimeRangeCharactorView";
import { FuzzySessionGlobalContext } from "./30_FuzzySessionGlobalState";

export interface SessionViewModel extends ViewModel<SessionEntity> {
  //className,
  //main


  hourPx: number;

  onDragStart: (startY: number) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;

  dispatchSessionAction: (sessionAction: SessionAction) => void;

  isHovered: boolean;
}

export const titleChangeActionCreator =
  (title: string) => (session: SessionEntity) =>
    session.updateTitle(title);

export const changeTimeRangeActionCreator =
  (diff: TimeDiff) => (session: SessionEntity) =>
    session.changeTimeRange(diff);

export const timeRangeBackAction: SessionAction = changeTimeRangeActionCreator(
  new TimeDiff("-", 0, 15)
);

export const timeRangeGoAction: SessionAction = changeTimeRangeActionCreator(
  new TimeDiff("+", 0, 15)
);

export const changeEndTimeActionCreator =
  (diff: TimeDiff) => (session: SessionEntity) =>
    session.changeEndTime(diff);

export const endTimeBackAction: SessionAction = changeEndTimeActionCreator(
  new TimeDiff("-", 0, 15)
);

export const endTimeGoAction: SessionAction = changeEndTimeActionCreator(
  new TimeDiff("+", 0, 15)
);

class Text {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  update(value: string): this {
    return new Text(value) as this;
  }

  get value() {
    return this._value;
  }
}

const SessionDetailView: FC<SessionViewModel> = styled(
  ({
    className,
    main: session,

    dispatchSessionAction,
  }: SessionViewModel) => {
    const timeRange = session.timeRange;
    const hoursNum = timeRange.durationHour;

    const {users} = useContext(FuzzySessionGlobalContext);
    

    const [title, setTitle] = useState<Text>(new Text(session.title));

    useEffect(() => {
      setTitle(new Text(session.title));
    }, [session.title]);

    return (
      <article className={className}>
        {/* <div style={{fontSize:'13px'}}> 
        #{session.id.toString('short')} </div> */}
        <h2 className="e-title">
          <span className="e-title-text m-spacer">{session.title}ほげほげ</span>
          <span className="e-title-text m-constant">{session.title}</span>
          <input
            className="e-title-text m-fluid"
            type="text"
            name="title"
            id="title"
            value={title.value}
            onChange={(e) => {
              setTitle(title.update(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatchSessionAction(titleChangeActionCreator(title.value));

                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => {
              dispatchSessionAction(titleChangeActionCreator(title.value));
            }}
          />
        </h2>

        <div className="e-time-range-text">
          <TimeRangeCharactorView
            main={timeRange}
            dispatchAction={(action) => {
              dispatchSessionAction((session) =>
                session.setTimeRange(action(timeRange))
              );
            }}
          />
        </div>

        <p>参加者：</p>
        <ul>
          {session.members &&
            [...session.members].map((memberId) => (
              <li>{users.get(memberId)?.name}</li>
            ))}
        </ul>
      </article>
    );
  }
)`
  padding: 5px;
  width: 300px;
  background: white;

  .e-title {
    position: relative;
    line-height: 1;

    overflow: hidden;

    &:hover {
      overflow: visible;
    }

    > .e-title-text {
      margin: 0;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      border-bottom: 1px solid #ccc;

      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;

      dispplay: inline-block;
      white-space: nowrap;

      &.m-spacer {
        visibility: hidden;
      }
      &.m-constant {
        position: absolute;
        top: 0;
        left: 0;
      }

      &.m-fluid {
        position: absolute;
        top: 0;
        left: 0;

        background: hsla(0, 50%, 100%, 1);

        opacity: 0;

        transition: opacity 0.2s ease-in-out, top 0.2s ease-in-out;

        &:hover {
          opacity: 1;
          color: #555;
        }

        &:focus {
          opacity: 0.9;
          border-bottom: 1px solid #000;
          outline: none;
          color: 1px solid #000;
        }
      }
    }
  }
`;

export default SessionDetailView;
