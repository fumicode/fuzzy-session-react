import { FC, useEffect, useState } from "react";
import styled from "styled-components";

import ViewModel from "../00_Framework/00_ViewModel";

import { TimeRangeTextView, TimeDiff } from "./FuzzyTimePackage/index";

import classNames from "classnames";
import { peekIntoFuture } from "../00_Framework/00_Action";
import SessionEntity, { SessionAction } from "./20_SessionEntity";
import { log } from "console";
import UserEntity from "./20_UserEntity";

export interface SessionViewModel extends ViewModel<SessionEntity> {
  //className,
  //main

  users: Map<string, UserEntity>;

  hourPx: number;

  onDragStart: (startY: number) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;

  actionDispatcher: (sessionAction: SessionAction) => void;

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

    console.log(this._value);
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
    className: c,
    main: session,
    users,

    onDoubleClick,
    actionDispatcher,
  }: SessionViewModel) => {
    console.log("SessionDetailView render");
    console.log(session.title);

    const timeRange = session.timeRange;
    const hoursNum = timeRange.durationHour;

    const [title, setTitle] = useState<Text>(new Text(session.title));

    useEffect(() => {
      setTitle(new Text(session.title));
    }, [session.title]);

    return (
      <section
        className={c}
        onDoubleClick={(e) => {
          onDoubleClick && onDoubleClick(e);
        }}
      >
        {/* <div style={{fontSize:'13px'}}> 
        #{session.id.toString('short')} </div> */}
        <div style={{ fontSize: "13px" }}>
          <input
            type="text"
            name="title"
            id="title"
            value={title.value}
            onChange={(e) => {
              setTitle(title.update(e.target.value));
              console.log("change");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                actionDispatcher(titleChangeActionCreator(title.value));

                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => {
              actionDispatcher(titleChangeActionCreator(title.value));
            }}
          />
        </div>
        <div style={{ fontSize: "10px" }}>
          <TimeRangeTextView main={timeRange} />
        </div>

        <p>参加者：</p>
        <ul>
          {session.members &&
            [...session.members].map((memberId) => (
              <li>{users.get(memberId)?.name}</li>
            ))}
        </ul>
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
      </section>
    );
  }
)`
  position: relative;

  width: 250px;
  height: 300px;

  border: 1px solid white;

  background: hsla(280, 50%, 54%, 0.8);

  color: white;
`;

export default SessionDetailView;
