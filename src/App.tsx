import ConflictsWarningSessionMap from './Components/ConflictsWarningSessionList';
import { DailyTimelineWithConflictsView } from './Components/DailyTimelineViewWithConflicts';
import SessionEntity from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC, useState } from 'react';

import styled from 'styled-components';
import update from 'immutability-helper';
import FuzzyTime from './Components/FuzzyTime';

let inchoSessions: SessionEntity[] = [
  new SessionEntity(
    undefined,
    '予定0',
    new TimeRange('09:00','11:00')
  ),
  new SessionEntity(
    undefined,
    '予定1',
    new TimeRange('10:00','12:00')
  ),
  new SessionEntity(
    undefined,
    '予定2',
    new TimeRange('11:00','14:00')
  ),
  new SessionEntity(
    undefined,
    '予定3',
    new TimeRange('15:00','17:00')
  ),
  new SessionEntity(
    undefined,
    '予定4',
    new TimeRange('17:00','18:00')
  ),
  new SessionEntity(
    undefined,
    '予定4',
    new TimeRange('18:00','20:00')
  ),
];

const taineiSessions: SessionEntity[] = [
  new SessionEntity(
    undefined,
    '勤務時間',
    new TimeRange('08:00','18:00')
  ),
  new SessionEntity(
    undefined,
    'タイ古式3時間',
    new TimeRange('09:00','12:00')
  ),
  new SessionEntity(
    undefined,
    'タイ古式1時間',
    new TimeRange('13:00','14:00')
  ),

  new SessionEntity(
    undefined,
    'タイ古式1時間',
    new TimeRange('16:40','17:00')
  ),
];

const ashitaroSessions: SessionEntity[] = [
  new SessionEntity(
    undefined,
    '院長アシスタント0',
    new TimeRange('09:00','10:00')
  ),
  new SessionEntity(
    undefined,
    '院長アシスタント1',
    new TimeRange('10:00','12:00')
  ),
  new SessionEntity(
    undefined,
    '院長アシスタント2',
    new TimeRange('12:00','14:00')
  ),
  new SessionEntity(
    undefined,
    '院長アシスタント3',
    new TimeRange('15:00','17:00')
  ),
  new SessionEntity(
    undefined,
    '院長アシスタント4',
    new TimeRange('18:00','20:00')
  ),
];


const inchoSessionMap = new ConflictsWarningSessionMap(inchoSessions);
const taineiSessionMap = new ConflictsWarningSessionMap(taineiSessions);
const ashitaroSessionMap = new ConflictsWarningSessionMap(ashitaroSessions);

interface Calendar{
  title: string,
  sessionMap: ConflictsWarningSessionMap
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
    sessionMap: ashitaroSessionMap 
  },
]

const App: FC = styled((props: {className: string})=> {
  const {className} = props;
  const [calendars, setCalendars] = useState<Calendar[]>(_calendars);

  return (
    <div className={className}>
      {
        calendars.map((cal,calIndex) => 
          <div className="e-column" key={calIndex}>
            <h2>{cal.title}</h2>
            <DailyTimelineWithConflictsView 
              main={cal.sessionMap} 
              showsTime={calIndex === 0} 
              onStartTimeBack={(sId)=>{
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if(session === undefined){
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeStartTime(
                  new FuzzyTime(
                    session.timeRange.start.hour - 1,
                    0
                  )
                );

                //永続化
                const newCals = update(calendars, {[calIndex]:{ sessionMap: (list)=>
                  list.set(addingSession.id, addingSession)
                }});
                setCalendars( newCals);


                //検索と永続化をリポジトリに隠蔽したいな。

              }}

              onStartTimeGo={(sId)=>{
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if(session === undefined){
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeStartTime(
                  new FuzzyTime(
                    session.timeRange.start.hour + 1,
                    0
                  )
                );

                //永続化
                const newCals = update(calendars, {[calIndex]:{ sessionMap: (list)=>
                  list.set(addingSession.id, addingSession)
                }});
                setCalendars( newCals);


                //検索と永続化をリポジトリに隠蔽したいな。
              }}

              onEndTimeBack={(sId)=>{
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if(session === undefined){
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeEndTime(
                  new FuzzyTime(
                    session.timeRange.end.hour - 1,
                    0
                  )
                );

                //永続化
                const newCals = update(calendars, {[calIndex]:{ sessionMap: (list)=>
                  list.set(addingSession.id, addingSession)
                }});
                setCalendars( newCals);


                //検索と永続化をリポジトリに隠蔽したいな。

              }}

              onEndTimeGo={(sId)=>{
                //要するに何をしたいかと言うと：
                //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

                //検索
                const session = calendars[calIndex].sessionMap.get(sId);
                if(session === undefined){
                  throw new Error("そんなことはありえないはず");
                }

                //更新
                const addingSession = session.changeEndTime(
                  new FuzzyTime(
                    session.timeRange.end.hour + 1,
                    0
                  )
                );

                //永続化
                const newCals = update(calendars, {[calIndex]:{ sessionMap: (list)=>
                  list.set(addingSession.id, addingSession)
                }});
                setCalendars( newCals);


                //検索と永続化をリポジトリに隠蔽したいな。
              }}
            />
          </div>
        )
      }
    </div>
  );
})`
display: flex;
flex-direction: row;

>.e-column{

  

}

`;

export default App;
