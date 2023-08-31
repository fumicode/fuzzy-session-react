


export default class FuzzyTime{
  //いったんファジーさの実装はおいておく。

  public readonly hour: number = 0;
  public readonly minute: number = 0;

  constructor( timeStr: string );
  constructor( cloneSrc: FuzzyTime);
  constructor( hour:number, minute:number);

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
      throw new Error('hour must be 0-23');
    }
    if(!( 0 <= minute && minute < 60)){
      throw new Error('minute must be 0-59');
    }

    
    this.hour = hour;
    this.minute = minute;

  }

  toString(): string{
    return `${((`00` + this.hour).slice(-2))}:${((`00` + this.minute).slice(-2))}`;
  }
}
