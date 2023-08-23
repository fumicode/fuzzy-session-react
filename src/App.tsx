import { DailyTimelineView } from './Components/DailyTimelineView';
import Session from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC } from 'react';


const sessions: Session[] = [
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
    new TimeRange('16:00','20:00')
  )
];

const App: FC = ()=> {

    
  return (
    <DailyTimelineView main={sessions}/>
  );
}

export default App;
