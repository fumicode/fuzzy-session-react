import './App.scss';
import Session, {SessionView} from './Components/Session';
import TimeRange from './Components/TimeRange';
import React, { FC } from 'react';


const App: FC = ()=> {
  const sessions: Session[] = [
    new Session(
      '予定1',
      new TimeRange('10:00','13:00')
    ),
    new Session(
      '予定2',
      new TimeRange('13:00','14:00')
    ),
    new Session(
      '予定3',
      new TimeRange('16:00','20:00')
    )
  ];

    
  return (
    <>
      {
        sessions.map((s)=>
          <>
            <SessionView main={s}/>
            <hr style={{margin:'100px 0px'}}/>
          </>
        )
      }

    </>
  );
}

export default App;
