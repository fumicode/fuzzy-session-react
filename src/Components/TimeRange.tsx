import React, { FC } from 'react';

import ViewModel from './ViewModel'
import { textSpanOverlap } from 'typescript';

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

export type TimeRangeViewModel = ViewModel<TimeRange>;

export const TimeRangeView: FC<TimeRangeViewModel> = (props:TimeRangeViewModel) => {
  const range: TimeRange = props.main;
  return (
    <>
      {range.start} 〜 {range.end}
    </>
  );
}