import { FC } from 'react';
import styled from 'styled-components';

import 'core-js/features/array';

import Session, { SessionView } from './Session'
import ViewModel from './ViewModel'

export type DailyTimelineViewModel = ViewModel<Session[]>;

export const DailyTimelineView: FC<DailyTimelineViewModel> = styled((props: DailyTimelineViewModel)=>{
  const sessions = props.main;

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  return (
    <div className={props.className}>
      {
        hoursArray.map((hour)=>
          <div className='e-hour-line'>
            <div className="e-hour-label">{hour}:00</div>
            <div className="e-hour-content">
            {
              (sessionsBelongsToHour.get(hour) || []).map((session)=>
                <SessionView main={session}/>
              )
            }
            </div>
          </div>
        )
      }
    </div>
  );
})`
display: flex;
flex-direction: column;

>.e-hour-line{
  position: relative;

  height: 50px;
  &::before{
    position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
    display: block;
    content: ' ';
    border-top: 1px solid #ccc;
  }

  display: flex;

  >.e-hour-label{

    font-size: 10px;
    color: #333;

  }
  >.e-hour-content{
  }
}
`;

function distributeSessionsToHours(sessions: Session[]) {
  const hourToSessions = sessions.reduce((map, s)=>{
    map.set(s.openingTimeRange.startHour, (map.get(s.openingTimeRange.startHour) || []).concat(s));

    return map;
  }, new Map<number, Session[]>());

  return hourToSessions;
  
}