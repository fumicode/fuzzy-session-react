import ConflictsWarningSessionList from './Components/ConflictsWarningSessionList';
import { DailyTimelineWithConflictsView } from './Components/DailyTimelineViewWithConflicts';
import Session from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC } from 'react';

import styled from 'styled-components';

const inchoSessions: Session[] = [
  new Session(
    undefined,
    '予定0',
    new TimeRange('09:00','10:00')
  ),
  new Session(
    undefined,
    '予定1',
    new TimeRange('10:00','12:00')
  ),
  new Session(
    undefined,
    '予定2',
    new TimeRange('12:00','14:00')
  ),
  new Session(
    undefined,
    '予定3',
    new TimeRange('15:00','17:00')
  ),
  new Session(
    undefined,
    '予定4',
    new TimeRange('16:00','19:00')
  ),
  new Session(
    undefined,
    '予定4',
    new TimeRange('18:00','20:00')
  ),
];

const taineiSessions: Session[] = [
  new Session(
    undefined,
    'タイ古式3時間',
    new TimeRange('09:00','12:00')
  ),
  new Session(
    undefined,
    'タイ古式1時間',
    new TimeRange('13:00','14:00')
  ),

  new Session(
    undefined,
    'タイ古式1時間',
    new TimeRange('16:40','17:00')
  ),
];

const ashitaroSessions: Session[] = [
  new Session(
    undefined,
    '院長アシスタント0',
    new TimeRange('09:00','10:00')
  ),
  new Session(
    undefined,
    '院長アシスタント1',
    new TimeRange('10:00','12:00')
  ),
  new Session(
    undefined,
    '院長アシスタント2',
    new TimeRange('12:00','14:00')
  ),
  new Session(
    undefined,
    '院長アシスタント3',
    new TimeRange('15:00','17:00')
  ),
  new Session(
    undefined,
    '院長アシスタント4',
    new TimeRange('18:00','20:00')
  ),
];


const inchoSessionList = new ConflictsWarningSessionList(inchoSessions);
const taineiSessionList = new ConflictsWarningSessionList(taineiSessions);
const ashitaroSessionList = new ConflictsWarningSessionList(ashitaroSessions);

const calendars = [
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
  return (
    <div className={className}>
      {
        calendars.map((cal,index) => 
          <div className="e-column">
            <h2>{cal.title}</h2>
            <DailyTimelineWithConflictsView main={cal.list} showsTime={index === 0} />
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
