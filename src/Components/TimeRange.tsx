import React, { FC } from 'react';

import ViewModel from './ViewModel'

export default class TimeRange{
  constructor(
    readonly start: string,
    readonly end: string
  ){ }

  get durationHour():number{
    const startDate = new Date(`2023-08-22T${this.start}`);
    const endDate = new Date(`2023-08-22T${this.end}`);

    //TODO: 簡易的な計算!!!! いずれ、date-fnsなどのlibを使って厳密に計算したい。
    const duration = endDate.getHours() - startDate.getHours();

    return duration ;
  }
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