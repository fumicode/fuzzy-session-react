import ConflictsWarningSessionList from './Components/ConflictsWarningSessionList';
import { DailyTimelineWithConflictsView } from './Components/DailyTimelineViewWithConflicts';
import SessionEntity from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC, useState } from 'react';

import styled from 'styled-components';

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


const inchoSessionList = new ConflictsWarningSessionList(inchoSessions);
const taineiSessionList = new ConflictsWarningSessionList(taineiSessions);
const ashitaroSessionList = new ConflictsWarningSessionList(ashitaroSessions);

interface Calendar{
  title: string,
  list: ConflictsWarningSessionList
}

const _calendars: Calendar[] = [
  {
    title: "院長",
    list: inchoSessionList,
  },
  {
    title: "タイ姉",
    list: taineiSessionList,
  },
  {
    title: "アシ太郎",
    list: ashitaroSessionList 
  },
]

const App: FC = styled((props: {className: string})=> {
  const {className} = props;
  const [calendars, setCalendars] = useState<Calendar[]>(_calendars);

  return (
    <div className={className}>
      {
        calendars.map((cal,index) => 
          <div className="e-column" key={index}>
            <h2>{cal.title}</h2>
            <DailyTimelineWithConflictsView 
              main={cal.list} 
              showsTime={index === 0} 
              onStartTimeBack={(sId)=>{
                const sessionIndex = inchoSessions.findIndex(
                  session => session.id.equals(sId)
                )

                console.log({
                  sessionIndex,
                  inchoSessions
                })

                const session = inchoSessions[sessionIndex];

                if(sessionIndex === -1){
                  throw new Error("sessionが見つかりません")
                }

                const newSession = session.changeStartTime((
                  ('00' + (session.timeRange.startHour - 1)).slice(-2)
                )+":00")

                inchoSessions = [
                  ...inchoSessions.slice(0, sessionIndex),
                     newSession,
                  ...inchoSessions.slice(sessionIndex+1)
                ]

                
                setCalendars([
                  {
                    title: "院長",
                    list: new ConflictsWarningSessionList(inchoSessions)
                  },
                  {
                    title: "タイ姉",
                    list: taineiSessionList,
                  },
                  {
                    title: "アシ太郎",
                    list: ashitaroSessionList 
                  },
                ]);

              }}

              onStartTimeGo={
                (sId)=>{
                  const sessionIndex = inchoSessions.findIndex(
                    session => session.id.equals(sId)
                  )

                  console.log({
                    sessionIndex,
                    inchoSessions
                  })
                  
                  if(sessionIndex === -1){
                    throw new Error("sessionが見つかりません")
                  }

                  const session = inchoSessions[sessionIndex];

                  const newSession = session.changeStartTime((

                    ('00' + (session.timeRange.startHour + 1)).slice(-2)
                  )+":00")

                  inchoSessions = [
                    ...inchoSessions.slice(0, sessionIndex),
                       newSession,
                    ...inchoSessions.slice(sessionIndex+1)

                  ]

                  setCalendars([
                    {
                      title: "院長",
                      list: new ConflictsWarningSessionList(inchoSessions)
                    },
                    {
                      title: "タイ姉",
                      list: taineiSessionList,
                    },
                    {
                      title: "アシ太郎",
                      list: ashitaroSessionList 
                    },
                  ]);

                }

              }
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
