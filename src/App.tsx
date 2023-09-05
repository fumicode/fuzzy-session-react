import ConflictsWarningSessionMap from "./Components/20_ConflictsWarningSessionList";
import { DailyTimelineWithConflictsView } from "./Components/30_DailyTimelineViewWithConflicts";
import SessionEntity, { SessionFuture, SessionId } from "./Components/20_SessionEntity";
import TimeRange from "./Components/10_TimeRange";
import { FC, useState } from "react";

import styled from "styled-components";
import update from "immutability-helper";
import { TimeDiff } from "./Components/10_FuzzyTime";

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

const inchoSessionMap = new ConflictsWarningSessionMap(inchoSessions);
const taineiSessionMap = new ConflictsWarningSessionMap(taineiSessions);
const ashitaroSessionMap = new ConflictsWarningSessionMap(ashitaroSessions);

interface Calendar {
  title: string;
  sessionMap: ConflictsWarningSessionMap;
}

const _calendars: Calendar[] = [
  {
    title: "院長",
    sessionMap: inchoSessionMap,
  },
  {
    title: "タイ姉",
    sessionMap: taineiSessionMap,
  },
  {
    title: "アシ太郎",
    sessionMap: ashitaroSessionMap,
  },
];

const App: FC = styled((props: { className: string }) => {
  const { className } = props;
  const [calendars, setCalendars] = useState<Calendar[]>(_calendars);

  const goIntoFutureSession = (calIndex:number, sId: SessionId, sessionFuture: SessionFuture) => {
    //要するに何をしたいかと言うと：
    //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

    //検索
    const session = calendars[calIndex].sessionMap.get(sId);
    if (session === undefined) {
      throw new Error("そんなことはありえないはず");
    }

    try{
      const futureSession = sessionFuture(session);

      //永続化
      const newCals = update(calendars, {
        [calIndex]: {
          sessionMap: (list) =>
            list.set(futureSession.id, futureSession),
        },
      });
      setCalendars(newCals);
    }
    catch(e){
      console.log(e);
    }
  }


  return (
    <div className={className}>
      <h1>🤖チャピスケ！📆　　（FuzzySession）</h1>
      <div className="e-calendar-columns">
        {calendars.map((cal, calIndex) => (
          <div className="e-column" key={calIndex}>
            <h2>{cal.title}</h2>
            <DailyTimelineWithConflictsView
              main={cal.sessionMap}
              showsTime={calIndex === 0}
              onStartTimeChange={ (sId, future)=>{goIntoFutureSession(calIndex, sId, future)} }

              onEndTimeBack={(sId) => {
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if (session === undefined) {
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeEndTime(
                  new TimeDiff(-1, 1, 0)
                );

                //永続化
                const newCals = update(calendars, {
                  [calIndex]: {
                    sessionMap: (list) =>
                      list.set(addingSession.id, addingSession),
                  },
                });
                setCalendars(newCals);

                //検索と永続化をリポジトリに隠蔽したいな。
              }}
              onEndTimeGo={(sId) => {
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if (session === undefined) {
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeEndTime(
                  new TimeDiff(+1, 1, 0)
                );

                //永続化
                const newCals = update(calendars, {
                  [calIndex]: {
                    sessionMap: (list) =>
                      list.set(addingSession.id, addingSession),
                  },
                });
                setCalendars(newCals);

                //検索と永続化をリポジトリに隠蔽したいな。
              }}
              onTimeRangeChange={(sId, diffHour) => {
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if (session === undefined) {
                  throw new Error("そんなことはありえないはず");
                }

                //更新

                const sessionFuture = (
                  session: SessionEntity
                ): SessionEntity => {
                  const diffObj = new TimeDiff(
                    diffHour >= 0 ? 1 : -1,
                    Math.abs(Math.round(diffHour)),
                    0
                  );
                  const addingSession = session
                    .changeStartTime(diffObj)
                    .changeEndTime(diffObj);

                  return addingSession;
                };

                try {
                  const futureSession = sessionFuture(session);

                  //永続化
                  const newCals = update(calendars, {
                    [calIndex]: {
                      sessionMap: (list) =>
                        list.set(futureSession.id, futureSession),
                    },
                  });
                  setCalendars(newCals);
                } catch (e) {
                  return;
                }
              }}
            />
          </div>
        ))}
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

export default App;
