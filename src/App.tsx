import ConflictsWarningSessionList from './Components/ConflictsWarningSessionList';
import { DailyTimelineWithConflictsView } from './Components/DailyTimelineViewWithConflicts';
import Session from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC } from 'react';


const sessions: Session[] = [
  new Session(
    undefined,
    '予定0',
    new TimeRange('09:00','11:00')
  ),
  new Session(
    undefined,
    '予定1',
    new TimeRange('10:00','13:00')
  ),
  new Session(
    undefined,
    '予定2',
    new TimeRange('13:00','14:00')
  ),
  new Session(
    undefined,
    '予定3',
    new TimeRange('15:00','17:00')
  ),
  new Session(
    undefined,
    '予定4',
    new TimeRange('16:00','20:00')
  ),
  new Session(
    undefined,
    '予定4',
    new TimeRange('18:00','20:00')
  ),
];


const conflictsWarningSessionList = new ConflictsWarningSessionList(sessions);

const App: FC = ()=> {

    
  return (
    <DailyTimelineWithConflictsView main={conflictsWarningSessionList}/>
    //<DailyTimelineView main={sessions}/>
  );
}

export default App;
