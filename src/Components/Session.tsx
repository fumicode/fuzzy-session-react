import { FC } from 'react';
import styled from 'styled-components';

import ViewModel from './ViewModel'

import TimeRange, { TimeRangeTextView } from './TimeRange';
import crypto from 'crypto';

export class SessionId{
  private readonly _value: string;

  constructor(value: string | undefined = undefined){
    if(value === undefined){
      //TODO: なぜかcrypto.randomUUIDが使えないので、簡易的なやりかた
      value = crypto.randomBytes(20).toString('hex');
    }

    this._value = value;
  }

  toString(mode:string|undefined = undefined):string{
    if(mode === 'short'){
      return this._value.substring(0,8);
    }
    return this._value;
  }

  equals(otherId: SessionId): boolean{
    return this._value === otherId._value;
  }
}

type FuzzyTime = string;

export default class SessionEntity{
  readonly id: SessionId;


  constructor(
    id: SessionId | undefined,
    readonly title:string,
    readonly timeRange: TimeRange,
    readonly prev: SessionEntity | undefined = undefined
  ){
    if(!id){
      id = new SessionId();
    }

    this.id = id;
  }


  overlaps(otherSession: SessionEntity): TimeRange | undefined{
    return this.timeRange.overlaps(otherSession.timeRange);
  }

  changeStartTime(start: FuzzyTime): SessionEntity{
    return new SessionEntity(
      this.id,
      this.title,
      new TimeRange(start, this.timeRange.end),
      this
    );
  }

  changeEndTime(start: FuzzyTime): TimeRange {
    return new TimeRange(start, this.timeRange.end);
  }
}

export interface SessionViewModel extends ViewModel<SessionEntity>{
  //className,
  //main

  onStartTimeBack : ()=>void;
  onStartTimeGo : ()=>void;
}

export const SessionView: FC<SessionViewModel> = styled(({ 
  className: c,
  main: session,
  onStartTimeBack,
  onStartTimeGo,
}: SessionViewModel)=>{
  const timeRange = session.timeRange;
  const hoursNum = timeRange.durationHour;
  
  return (
    <div className={c} style={{height:`${hoursNum*50}px`}}>
      {
      /*
      <div style={{fontSize:'13px'}}>
        #{session.id.toString('short')}
      </div>
      */
      }
      <div style={{fontSize:'13px'}}>
        {session.title}
      </div>
      <div style={{fontSize:'10px'}}>
        <TimeRangeTextView main={timeRange} />
      </div>
      <div className="e-time-range-wrapper m-start">
        <div className="e-time-range">
          {session.timeRange.start}〜
        </div>

        <div className="e-control-buttons">
          <button className="e-button m-up" onClick={(e)=>{
            onStartTimeBack()
          }}>▲</button>
          <button className="e-button m-down" onClick={(e)=>{
            onStartTimeGo()
          }}
          >▼</button>
        </div>
      </div>
      <div className="e-time-range-wrapper m-end">
        <div className="e-time-range">
          〜{session.timeRange.end}
        </div>
      </div>
      <div className="e-fuzzy-box m-start"></div>
      <div className="e-fuzzy-box m-end"></div>
    </div>
  );
})`
position: relative;

width: 100px;
height:  200px; //とりあえず仮で

border:1px solid white;

background: hsla(280, 50%, 54%, 0.8);

color: white;


&:hover{
  > .e-time-range-wrapper{

    > .e-time-range{
      max-height: 100px;
      padding: 3px; //TODO: ここにこれ書くの汚い
      
      color: black;
    }

    > .e-control-buttons{
      display:block;

    }
  }
}

> .e-time-range-wrapper{
  position: absolute;
    left: 0;
    right: 0;
    z-index: 1;

  &.m-start{
    position: absolute;
      top: 0;

    > .e-time-range{
      bottom: 0;

      border-radius: 5px 5px 0 0;
    }
  }

  &.m-end{
    position: absolute;
      bottom: 0;

    > .e-time-range{
      top: 0;

      border-radius: 0 0 5px 5px;
    }
  }

  > .e-time-range{
    position: absolute;
      left: 0;
    box-sizing: border-box;

    max-height: 0;
    padding: 0; //TODO: ここにこれ書くの汚い


    overflow: hidden;

    padding-right: 10px;
    line-height: 1;

    font-size: 10px;

    background-color: #ddd;

    white-space: nowrap;
  }

  > .e-control-buttons{
    display:none;
    position: absolute;
      right: 0;
    width: 0;

    > .e-button{
      position: absolute;

      &.m-up{
        bottom: 0;
      }
      &.m-down{
        top: 0;
      }
      
    }
  }


}


> .e-fuzzy-box{
  position: absolute;
    left: 0;
    right: 0;
    z-index: -1;


  height: 50px;

  
  //background: radial-gradient(hsla(280, 50%, 54%, 1), transparent);
  background: linear-gradient(
    hsla(252, 50%, 54%, 0.2),
    hsla(252, 50%, 54%, 0.8), 
    hsla(252, 50%, 54%, 0.2)
  );

  border-radius: 5px;
  

  &.m-start{
    top: 0;
    margin-top: -25px;
  }

  &.m-end{
    bottom: 0;
    margin-bottom: -25px;
  }
}
`;

