import SessionEntity, { SessionId } from "../20_SessionEntity";

import Conflict from "./20_Conflict";
import { TimeRange } from "../FuzzyTimePackage";

import update from "immutability-helper";
import { th } from "date-fns/locale";

export default class Timeline {
  private readonly _conflicts: Conflict[];

  //あえて外に見せるkeyの型は、SessionIdにしている。
  //外からは、SessionIdで参照でき、内部的には確実なstringで参照できる。
  private readonly _sessions: Map<string, TimelineSession>; //TODO: これは、禁忌かもしれない。ID参照になおすべきかも。

  constructor(sessions: Iterable<SessionEntity>);
  constructor(sessions: Map<string, TimelineSession>);

  constructor(
    sessions: Iterable<SessionEntity> | Map<string, TimelineSession>
  ) {
    if (sessions instanceof Map) {
      this._sessions = sessions;
    } else {
      //iterable

      this._sessions = new Map(
        [...sessions].map((session) => [
          session.id.toString(),
          new TimelineSession(session),
        ])
      );
    }

    this._conflicts = this.findConflicts([...this._sessions.values()]);
  }

  get(key: SessionId): TimelineSession | undefined {
    return this._sessions.get(key.toString());
  }

  has(key: SessionId): boolean {
    return this._sessions.has(key.toString());
  }

  set(key: SessionId, value: SessionEntity): this {
    const newMap = new Map(this._sessions);
    newMap.set(key.toString(), new TimelineSession(value));

    //return new this.constructor(Array.from(newMap.values()));
    //ができないので、仕方なくそうしている。
    //TODO: 自分自身のクラスをnewする方法がほしいのだが・・・
    return new ThisClass(newMap) as this;
  }

  get size(): number {
    return this._sessions.size;
  }

  get [Symbol.toStringTag](): string {
    return "ConflictsWarningSessionList";
  }

  setSessionTimeRange(sessionId: SessionId, timeRange: TimeRange): this {
    const currentSession = this.get(sessionId);

    if (currentSession === undefined) {
      throw new Error(
        `このカレンダータイムライにはセッション${sessionId.toString()}が存在しません。`
      );
    }

    const newSessions = update(this._sessions, {
      $add: [[sessionId.toString(), currentSession.setTimeRange(timeRange)]],
    });

    return new Timeline(newSessions) as this;
  }

  get sessions(): TimelineSession[] {
    return this.orderedSessionsByTimeRange; //互換性のために、ソートしておく。
  }

  get orderedSessionsByTimeRange(): TimelineSession[] {
    return Array.from(this._sessions.values()).sort((a, b) =>
      a.timeRange.compare(b.timeRange)
    );
  }

  private findConflicts(sessions: TimelineSession[]): Conflict[] {
    //予めソートしておいたほうが、楽にコンフリクトを探せる。
    sessions = sessions.sort((a, b) => a.timeRange.compare(b.timeRange));
    let conflicts: Conflict[] = [];
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        if (sessions[i].overlaps(sessions[j])) {
          conflicts.push(new Conflict(sessions[i], sessions[j]));
        }
      }
    }
    return conflicts;
  }

  get conflicts(): Conflict[] {
    return this._conflicts;
  }
}

const ThisClass = Timeline;

interface TimelineSessionSpec {
  readonly title: string;
  readonly timeRange: TimeRange;
}

export class TimelineSession {
  readonly id: SessionId;

  //非常に本質的な要素だけ、エンティティから抽出し、保存しておく。
  //その後はイベント機構などで整合性を保つ。
  readonly title: string;
  readonly timeRange: TimeRange;

  constructor(session: SessionEntity);
  constructor(id: SessionId, spec: TimelineSessionSpec);
  constructor(
    sessionOrId: SessionEntity | SessionId,
    spec: TimelineSessionSpec | undefined = undefined
  ) {
    if (sessionOrId instanceof SessionEntity) {
      const session = sessionOrId;
      this.id = session.id;
      this.title = session.title;
      this.timeRange = session.timeRange;
    } else if (sessionOrId instanceof SessionId && spec !== undefined) {
      const sessionId = sessionOrId;
      this.id = sessionId;
      this.title = spec.title;
      this.timeRange = spec.timeRange;
    } else {
      throw new Error("TimelineSessionのコンストラクタの引数がおかしいです。");
    }
  }

  exportSpec(): TimelineSessionSpec {
    return {
      title: this.title,
      timeRange: this.timeRange,
    };
  }

  overlaps(otherSession: this): TimeRange | undefined {
    return this.timeRange.overlaps(otherSession.timeRange);
  }

  setTimeRange(timeRange: TimeRange): this {
    return this.update({
      timeRange,
    });
  }

  update(changingContent: Partial<TimelineSessionSpec>): this {
    return new TimelineSession(
      this.id,
      Object.assign(this.exportSpec(), changingContent)
    ) as this;
  }

  hoge() {
    return "hoge";
  }
}
