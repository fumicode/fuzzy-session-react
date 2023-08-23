import { FC } from 'react';
import 'core-js/features/array';

import Session, { SessionView } from './Session'
import ViewModel from './ViewModel'

export type DailyTimelineViewModel = ViewModel<Session[]>;

export const DailyTimelineView: FC<DailyTimelineViewModel> = (props)=>{
  const sessions = props.main;

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  return (
    <div className='c-daily-timeline'>
      {
        hoursArray.map((hour)=>
          <div className='e-hour'>
            {hour}:00
            {
              (sessionsBelongsToHour.get(hour) || []).map((session)=>
                <div style={{marginLeft:'100px'}}>
                  <SessionView main={session}/>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
}

function distributeSessionsToHours(sessions: Session[]) {
  const hourToSessions = sessions.reduce((map, s)=>{
    map.set(s.openingTimeRange.startHour, (map.get(s.openingTimeRange.startHour) || []).concat(s));

    return map;
  }, new Map<number, Session[]>());

  return hourToSessions;
  
}