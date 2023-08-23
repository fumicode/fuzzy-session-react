import { FC } from 'react';
import styled from 'styled-components';

import 'core-js/features/array';

import Session, { SessionView } from './Session'
import ViewModel from './ViewModel'
import ConflictsWarningSessionList from './ConflictsWarningSessionList';
import { TimeRangeView } from './TimeRange';

export type DailyTimelineWithConflictsViewModel = ViewModel<ConflictsWarningSessionList>;

export const DailyTimelineWithConflictsView: FC<DailyTimelineWithConflictsViewModel> = styled((props: DailyTimelineWithConflictsViewModel)=>{
  const sessions = props.main.sessions;
  const conflicts = props.main.conflicts;

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  return (
    <div className={props.className}>
      {
        hoursArray.map((hour)=>
          <div className='e-hour-line' key={hour}>
            <div className="e-hour-label">{hour}:00</div>
            <div className="e-hour-content">
            </div>
          </div>
        )
      }
      <div className="e-contents">
        {
          sessions.map((session)=>
            {
              //todo: 50がマジックナンバーになっている！！ DOM描画時に取得するようにする。

              const y = session.openingTimeRange.startHour * 50;
              return (
                <div className="e-session-box" style={{top: y +'px'}} key={session.id.toString()}>
                  <SessionView main={session}/>
                </div>
              )
            }
          )
        }
      </div>
      <div className="e-statuses">
        {
          conflicts.map((conflict)=>
            {
              const conflictDuration = conflict.overlappingTimeRange.durationHour;

              const y = conflict.overlappingTimeRange.startHour * 50;
              const conflictId = conflict.sessionIds.join('-');

              return (
                <div className="e-status-box" style={{top: y +'px'}} key={conflictId}>
                  <TimeRangeView main={conflict.overlappingTimeRange}>
                    {conflict.toString('horribleness-emoji')}
                  </TimeRangeView>
                </div>
              )
            }
          )
        }
      </div>
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


>.e-contents{
  position: absolute;
    left: 60px;

  >.e-session-box{
    position: absolute;
    z-index: 1;
  }

}

>.e-statuses{
  position: absolute;
    left: 40px;

  >.e-status-box{
    position: absolute;
    z-index: 1;
    width: 20px;
  }

}
`;
