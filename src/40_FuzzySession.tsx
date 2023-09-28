import Timeline from "./Components/20_Timeline";
import SessionEntity, {
  SessionAction,
  SessionId,
} from "./Components/20_SessionEntity";
import TimeRange from "./Components/10_TimeRange";
import { FC, useState } from "react";

import styled from "styled-components";
import update from "immutability-helper";
import { ThreeRows } from "./Components/20_GaiaCode/20_GaiaCode";
import { DailyTimelineWithConflictsView } from "./Components/30_DailyTimelineViewWithConflicts";

let inchoSessions: SessionEntity[] = [
  new SessionEntity(undefined, "予定0", new TimeRange("09:00", "11:00")),
  new SessionEntity(undefined, "予定1", new TimeRange("10:00", "12:00")),
  new SessionEntity(undefined, "予定2", new TimeRange("11:00", "14:00")),
  new SessionEntity(undefined, "予定3", new TimeRange("15:00", "17:00")),
  new SessionEntity(undefined, "予定4", new TimeRange("17:00", "18:00")),
  new SessionEntity(undefined, "予定4", new TimeRange("18:00", "20:00")),
];

const taineiSessions: SessionEntity[] = [
  new SessionEntity(undefined, "勤務時間", new TimeRange("08:00", "18:00")),
  new SessionEntity(
    undefined,
    "タイ古式3時間",
    new TimeRange("09:00", "12:00")
  ),
  new SessionEntity(
    undefined,
    "タイ古式1時間",
    new TimeRange("13:00", "14:00")
  ),

  new SessionEntity(
    undefined,
    "タイ古式1時間",
    new TimeRange("16:40", "17:00")
  ),
];

const ashitaroSessions: SessionEntity[] = [
  new SessionEntity(
    undefined,
    "院長アシスタント0",
    new TimeRange("09:00", "10:00")
  ),
  new SessionEntity(
    undefined,
    "院長アシスタント1",
    new TimeRange("10:00", "12:00")
  ),
  new SessionEntity(
    undefined,
    "院長アシスタント2",
    new TimeRange("12:00", "14:00")
  ),
  new SessionEntity(
    undefined,
    "院長アシスタント3",
    new TimeRange("15:00", "17:00")
  ),
  new SessionEntity(
    undefined,
    "院長アシスタント4",
    new TimeRange("18:00", "20:00")
  ),
];

interface Calendar {
  title: string;
  sessionMap: Timeline;
}

const _calendars: Calendar[] = [
  {
    title: "院長",
    sessionMap: new Timeline(inchoSessions),
  },
  {
    title: "タイ姉",
    sessionMap: new Timeline(taineiSessions),
  },
  {
    title: "アシ太郎",
    sessionMap: new Timeline(ashitaroSessions),
  },
];

const FuzzySession: FC = styled((props: { className: string }) => {
  const {
    className,
    // position,
    // size,
    // parentSize,
    // children,
    // transitionState,
    // zIndex,
    // onMove,
    // debugMode,
  } = props;
  const [calendars, setCalendars] = useState<Calendar[]>(_calendars);

  const goIntoFutureCalendar = (
    calIndex: number,
    sId: SessionId,
    sessionAction: SessionAction
  ) => {
    //要するに何をしたいかと言うと：
    //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

    //検索
    const session = calendars[calIndex].sessionMap.get(sId);
    if (session === undefined) {
      throw new Error("そんなことはありえないはず");
    }

    try {
      const futureSession = sessionAction(session);

      //永続化
      const newCals = update(calendars, {
        [calIndex]: {
          sessionMap: (list) => list.set(futureSession.id, futureSession),
        },
      });
      setCalendars(newCals);
    } catch (e) {
      console.log(e);
    }
  };

  const code: ThreeRows = [
    [5, 8, 9, 5, 5, 9, 8],
    [0, 3, 6, 0, 0, 6, 3],
    [5, 3, 1, 5, 5, 1, 3],
  ];

  return (
    <div className={className}>
      <h1>🤖チャピスケ！📆　　（FuzzySession）</h1>
      <div className="e-calendar-columns">
        {calendars.map((cal, calIndex) => {
          const goIntoFutureSession = (sId: SessionId, action: SessionAction) =>
            goIntoFutureCalendar(calIndex, sId, action);
          return (
            <div className="e-column" key={calIndex}>
              <h2>{cal.title}</h2>
              <DailyTimelineWithConflictsView
                main={cal.sessionMap}
                showsTime={calIndex === 0}
                onTheSessionChange={goIntoFutureSession}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
})`
  .e-calendar-columns {
    display: flex;
    flex-direction: row;

    > .e-column {
    }
  }
`;

export default FuzzySession;
