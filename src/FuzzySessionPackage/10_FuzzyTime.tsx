import { add, sub } from "date-fns";
import zeroPadStr from "../01_Utils/01_zeroPadStr";
import TimeDiff from "./00_TimeDiff";

interface FuzzyTimeSpec {
  hour?: number;
  minute?: number;
}

const isFuzzyTimeSpec = (obj: any): obj is FuzzyTimeSpec => {
  //どれかが入っていれば、FuzzyTimeとみなす。
  return Number.isInteger(obj.hour) || Number.isInteger(obj.minute);
};

export default class FuzzyTime {
  //いったんファジーさの実装はおいておく。
  public readonly hour: number = 0;
  public readonly minute: number = 0;

  static strToSpec(timeStr: string): FuzzyTimeSpec {
    const [h, m] = timeStr.split(":");

    const hour = parseInt(h);
    const minute = parseInt(m);

    return { hour, minute };
  }

  constructor(timeStr: string);
  constructor(cloneSrc: FuzzyTime);
  constructor(spec: FuzzyTimeSpec);

  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  constructor(obj: FuzzyTime | string | FuzzyTimeSpec) {
    let hour: number = 0;
    let minute: number = 0;
    if (typeof obj === "string") {
      const spec = FuzzyTime.strToSpec(obj);
      hour = spec.hour || 0; //hourがあるとは限らないが
      minute = spec.minute || 0; //minuteがあるとは限らないが
    } else if (obj instanceof FuzzyTime) {
      const { hour: h, minute: m } = obj;
      hour = h;
      minute = m;
    } else if (isFuzzyTimeSpec(obj)) {
      hour = obj.hour || 0;
      minute = obj.minute || 0;
    } else {
      throw new Error("invalid argument");
    }

    if (!(0 <= hour && hour <= 24)) {
      throw new Error("hour must be 0-23. given: " + obj);
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

    const func = diff.sign === "-" ? sub : add;
    const newD = func(d, { minutes: diff.minute, hours: diff.hour });

    return new FuzzyTime({ hour: newD.getHours(), minute: newD.getMinutes() });
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
