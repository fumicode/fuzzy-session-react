import React, { FC } from 'react';

import ViewModel from './ViewModel'
import { textSpanOverlap } from 'typescript';
import styled from 'styled-components';

export default class TimeRange{
  constructor(
    readonly start: string,
    readonly end: string
  ){ }

  get startHour():number{
    return parseInt(this.start.split(':')[0]);
    //TODO ここで、parseIntを使うのは、よくない。
  }

  get endHour():number{
    return parseInt(this.end.split(':')[0]);
    //TODO ここで、parseIntを使うのは、よくない。
  }

  get durationHour():number{
    const startDate = new Date(`2023-08-22T${this.start}`);
    const endDate = new Date(`2023-08-22T${this.end}`);

    //TODO: 簡易的な計算!!!! いずれ、date-fnsなどのlibを使って厳密に計算したい。
    const duration = endDate.getHours() - startDate.getHours();

    return duration ;
  }

  overlaps(otherTR: TimeRange): TimeRange | undefined{

    if(!overlaps(this, otherTR)){
      return undefined;
    }
    else{
      const start = this.startHour > otherTR.startHour ? 
        this.start : 
        otherTR.start;

      const end = this.endHour < otherTR.endHour ? 
        this.end : 
        otherTR.end;

      return new TimeRange(start, end); 
    }

  }

  toString(): string{
    return `${this.start}〜${this.end}`;
  }
}

const overlaps = (a:TimeRange, b:TimeRange):boolean => {
  return !(
    (a.end <= b.start) ||
    (b.end <= a.start)
  );
}

export type TimeRangeViewModel = ViewModel<TimeRange> & {
  children?: React.ReactNode;

};

export const TimeRangeTextView: FC<TimeRangeViewModel> = (props:TimeRangeViewModel) => {
  const range: TimeRange = props.main;
  return (
    <>
      {range.start} 〜 {range.end}
    </>
  );
}

export const TimeRangeView: FC<TimeRangeViewModel> = styled((props:TimeRangeViewModel)=>{
  const className = props.className || '';
  const range = props.main;

  const hoursNum = range.durationHour;

  return (
    <div className={className} style={{height:`${hoursNum*50}px`}}>
      <div className="e-content">
        
        {props.children}

      </div>
      <div className="e-time-range-wrappers">
        <div className="e-time-range-wrapper m-start">
          <div className="e-time-range">
            {range.start}〜
          </div>
        </div>
        <div className="e-time-range-wrapper m-end">
          <div className="e-time-range">
            〜{range.end}
          </div>
        </div>
      </div>
    </div>
  );
})`
position: relative;

height:  200px; //とりあえず仮で

border:1px solid white;

background: red;


&:hover{
  > .e-time-range-wrapper > .e-time-range{
    max-height: 100px;
    padding: 3px; //TODO: ここにこれ書くの汚い
  }
}

> .e-content{
  position: relative;
  height: 100%;
  width: 100%;

}

> .e-time-range-wrappers{
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
}

`;

