import SessionEntity, { SessionId } from "./20_SessionEntity";
import { TimelineSession } from "./20_Timeline";
import { TimeRange } from "./FuzzyTimePackage/index";

export default class Conflict {
  public readonly overlappingTimeRange: TimeRange;
  public readonly sessionIds: [SessionId, SessionId]; // 2番目の方が後の予定であるとする

  constructor(
    sessionA: SessionEntity | TimelineSession,
    sessionB: SessionEntity | TimelineSession
  ) {
    const A_timeRange = sessionA.timeRange;
    const B_timeRange = sessionB.timeRange;

    const overlappingTimeRange = A_timeRange.overlaps(B_timeRange);

    if (!overlappingTimeRange) {
      throw new Error("２つのセッションの時間が重なっていません。");
    }
    this.overlappingTimeRange = overlappingTimeRange;
    const sessionPair = [sessionA, sessionB].sort((a, b) =>
      a.timeRange.compare(b.timeRange)
    );
    this.sessionIds = sessionPair.map((session) => session.id) as [
      SessionId,
      SessionId
    ];
  }

  //コンフリクトの酷さ = 長さとする。
  //TODO: 名前が曖昧かも。普通にdurationにしようかな？
  //いや、全体の長さによって、ひどく重なっているかどうかは変わってくる。あとでちゃんと定義しよう。誤差や不確かさの考え方を使う。
  get horribleness(): number {
    return this.overlappingTimeRange.durationHour;
  }

  toString(mode: StringMode | undefined = undefined): string {
    if (mode === "horribleness-emoji") {
      return this.toStringEmoji();
    }

    return `Conflict: ${this.overlappingTimeRange.toString()} #${this.sessionIds[0].toString(
      "short"
    )} <-> #${this.sessionIds[1].toString("short")}`;
  }

  toStringEmoji(): string {
    switch (true) {
      case 0 <= this.horribleness && this.horribleness <= 1:
        return "🤨";
      case this.horribleness <= 2:
        return "😢";
      case this.horribleness <= 3:
        return "😡";
      default:
        return "😱";
    }
  }
}

type StringMode = "horribleness-emoji";
