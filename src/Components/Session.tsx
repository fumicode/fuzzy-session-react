import React, { FC } from 'react';

import ViewModel from './ViewModel'

import TimeRange, { TimeRangeView } from './TimeRange';


export default class Session{
  constructor(
    readonly title:string,
    readonly openingTimeRange: TimeRange
  ){

  }
}

export type SessionViewModel = ViewModel<Session>;

export const SessionView: FC<SessionViewModel> = (props:SessionViewModel)=>{
  const session = props.main;
  const range = session.openingTimeRange;

  const hoursNum = range.durationHour;

  return (
    <div className="c-session" style={{height:`${hoursNum*40}px`}}>
      {session.title}
      <div className="e-time-range-wrapper m-start">
        <div className="e-time-range">
          {session.openingTimeRange.start}〜
        </div>
      </div>
      <div className="e-time-range-wrapper m-end">
        <div className="e-time-range">
          〜{session.openingTimeRange.end}
        </div>
      </div>
      <div className="e-fuzzy-box m-start"></div>
      <div className="e-fuzzy-box m-end"></div>
    </div>
  );
}

