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

export default class Session{
  readonly id: SessionId;

  constructor(
    id: SessionId | undefined,
    readonly title:string,
    readonly openingTimeRange: TimeRange
  ){
    if(!id){
      id = new SessionId();
    }

    this.id = id;
  }

  overlaps(otherSession: Session): TimeRange | undefined{
    return this.openingTimeRange.overlaps(otherSession.openingTimeRange);
  }
}

export type SessionViewModel = ViewModel<Session>;

export const SessionView: FC<SessionViewModel> = styled((props:SessionViewModel)=>{
  const className = props.className || '';
  const session = props.main;
  const range = session.openingTimeRange;

  const hoursNum = range.durationHour;

  return (
    <div className={className} style={{height:`${hoursNum*50}px`}}>
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
        <TimeRangeTextView main={range} />
      </div>
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
})`
position: relative;

width: 100px;
height:  200px; //とりあえず仮で

border:1px solid white;

background: hsla(280, 50%, 54%, 0.8);

color: white;


&:hover{
  > .e-time-range-wrapper > .e-time-range{
    max-height: 100px;
    padding: 3px; //TODO: ここにこれ書くの汚い
  }
}

> .e-time-range-wrapper{
  position: absolute;
    left: 0;
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

