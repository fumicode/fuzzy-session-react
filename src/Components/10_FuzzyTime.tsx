import { add, sub } from "date-fns";
import zeroPadStr from "../01_Utils/01_zeroPadStr";

export default class FuzzyTime {
  //いったんファジーさの実装はおいておく。
  public readonly hour: number = 0;
  public readonly minute: number = 0;

  constructor(timeStr: string);
  constructor(cloneSrc: FuzzyTime);
  constructor(hour: number, minute: number);

  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  constructor(hour: number | FuzzyTime | string, minute: number = 0) {
    if (typeof hour === "string") {
      const [h, m] = hour.split(":");

      hour = parseInt(h);
      minute = parseInt(m);
    } else if (typeof hour === "object") {
      const { hour: h, minute: m } = hour;
      hour = h;
      minute = m;
    } else {
      this.hour = hour;
      this.minute = minute;
    }

    if (!(0 <= hour && hour <= 24)) {
      throw new Error("hour must be 0-23. given: " + hour);
    }
    if (!(0 <= minute && minute < 60)) {
      throw new Error("minute must be 0-59. given: " + minute);
    }

    this.hour = hour;
    this.minute = minute;
  }

  change(diff: TimeDiff): FuzzyTime {
    const d = new Date(
      `2020-01-01T${zeroPadStr(this.hour, 2)}:${zeroPadStr(this.minute, 2)}:00`
    );

    const func = diff.sign === '-' ? sub : add;
    const newD = func(d, { minutes: diff.minute, hours: diff.hour });

    return new FuzzyTime(newD.getHours(), newD.getMinutes());
  }

  compare(other: FuzzyTime): number {
    const thisDate = new Date(
      `2020-01-01T${zeroPadStr(this.hour, 2)}:${zeroPadStr(this.minute, 2)}:00`
    );
    const otherDate = new Date(
      `2020-01-01T${zeroPadStr(other.hour, 2)}:${zeroPadStr(
        other.minute,
        2
      )}:00`
    );

    return thisDate.getTime() - otherDate.getTime(); //簡易的な実装だが十分。
  }

  toString(): string {
    return `${(`00` + this.hour).slice(-2)}:${(`00` + this.minute).slice(-2)}`;
  }
}

type PlusOrMinus = '+' | '-';

const isPlusOrMinus = (str: string): str is PlusOrMinus => {
  return str === '+' || str === '-';
}

export class TimeDiff {
  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  //いったん、時間と分だけ実装

  private _sign: PlusOrMinus;
  private _hour: number = 0;
  private _minute: number = 0;

  constructor( signedHour: number );
  constructor( sign: '+' | '-', hour: number );
  constructor( sign: '+' | '-', hour: number , minute: number );
  constructor(
    sign: PlusOrMinus | number = '+',
    hour: number = 0,
    minute: number = 0
  ) {
    if (typeof sign === 'number') {
      const signedHour = sign;
      sign = signedHour >= 0 ? '+' : '-';
      const abs =  Math.abs(signedHour);
      hour =  Math.round(abs);
      minute =  Math.round((abs % 1)*4) * 60 / 4;
    }

    if (!isPlusOrMinus(sign)) {
      throw new Error("sign must be + or -");
    }

    if (!(hour >= 0)) {
      throw new Error("hour must be positive");
    }

    if (!(minute >= 0)) {
      throw new Error("minute must be positive");
    }

    this._sign = sign;
    this._hour = hour;
    this._minute = minute;
  }

  get sign(): PlusOrMinus{
    return this._sign;
  }

  get hour(): number {
    return this._hour;
  }

  get minute(): number {
    return this._minute;
  }

  toString(): string {
    return `${(`00` + this.hour).slice(-2)}:${(`00` + this.minute).slice(-2)}`;
  }
}
