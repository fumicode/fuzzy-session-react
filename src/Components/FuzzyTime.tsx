

import {add, sub} from 'date-fns';
import zeroPadStr from '../Utils/zeroPadStr';

export default class FuzzyTime{
  //いったんファジーさの実装はおいておく。

  public readonly hour: number = 0;
  public readonly minute: number = 0;

  constructor( timeStr: string );
  constructor( cloneSrc: FuzzyTime);
  constructor( hour:number, minute:number);


  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  constructor(
    hour: number | FuzzyTime | string,
    minute: number = 0
  ){
    if(typeof hour === 'string'){
      const [h, m] = hour.split(':');

      hour = parseInt(h);
      minute = parseInt(m);
    }else if(typeof hour === 'object'){
      const {hour:h, minute:m} = hour;
      hour = h;
      minute = m;
    }
    else {
      hour = hour;
      minute = minute;
    }

    if(!( 0 <= hour && hour < 24 )){
      throw new Error('hour must be 0-23. given: ' + hour);
    }
    if(!( 0 <= minute && minute < 60)){
      throw new Error('minute must be 0-59. given: ' + minute);
    }

    
    this.hour = hour;
    this.minute = minute;

  }

  change(diff: TimeDiff): FuzzyTime{
    const d = new Date(`2020-01-01T${zeroPadStr(this.hour, 2)}:${zeroPadStr(this.minute, 2)}:00`);
    console.log(d);
    
    const func = diff.sign === -1 ? sub : add;
    const newD = func(d, {minutes: diff.minute, hours: diff.hour});

    return new FuzzyTime(
      newD.getHours(),
      newD.getMinutes()
    );
  }

  compare(other: FuzzyTime): number{
    const thisDate = new Date(`2020-01-01T${zeroPadStr(this.hour, 2)}:${zeroPadStr(this.minute, 2)}:00`);
    const otherDate = new Date(`2020-01-01T${zeroPadStr(other.hour, 2)}:${zeroPadStr(other.minute, 2)}:00`);

    return thisDate.getTime() - otherDate.getTime(); //簡易的な実装だが十分。
  }

  toString(): string{
    return `${((`00` + this.hour).slice(-2))}:${((`00` + this.minute).slice(-2))}`;
  }
}



export class TimeDiff{

  
  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  //いったん、時間と分だけ実装
  constructor(
    public sign: 1 | -1 = 1,
    public readonly hour: number = 0,
    public readonly minute: number = 0,
  ){
    if(!(sign === 1 || sign === -1)){
      throw new Error('sign must be 1 or -1');
    }

    if(!(hour >= 0)){
      throw new Error('hour must be positive');
    }

    if(!(minute >= 0)){
      throw new Error('minute must be positive');
    }
  }

  toString(): string{
    return `${((`00` + this.hour).slice(-2))}:${((`00` + this.minute).slice(-2))}`;
  }
}
