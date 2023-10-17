export type PlusOrMinus = "+" | "-";

export const isPlusOrMinus = (str: string): str is PlusOrMinus => {
  return str === "+" || str === "-";
};

export default class TimeDiff {
  //year(年), month(月), date(日), hour(時), minutes(分), second(秒), mili-second(ミリ秒)
  //いったん、時間と分だけ実装

  private _sign: PlusOrMinus;
  private _hour: number = 0;
  private _minute: number = 0;

  constructor(signedHour: number);
  constructor(sign: PlusOrMinus, hour: number);
  constructor(sign: PlusOrMinus, hour: number, minute: number);
  constructor(
    sign: PlusOrMinus | number = "+",
    hour: number = 0,
    minute: number = 0
  ) {
    if (typeof sign === "number") {
      const signedHour = sign;
      sign = signedHour >= 0 ? "+" : "-";
      const absTime = Math.abs(signedHour);
      hour = Math.floor(absTime);
      const hourDividingNumber = 6;
      //ここにこの知識を埋め込むのどうなん？というのはある。
      minute =
        (Math.round((absTime - hour) * hourDividingNumber) * 60) /
        hourDividingNumber;
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

  get sign(): PlusOrMinus {
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
