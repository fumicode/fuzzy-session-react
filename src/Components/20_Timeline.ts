import SessionEntity, { SessionId } from "./20_SessionEntity";

import Conflict from "./20_Conflict";

export default class Timeline {
  private readonly _conflicts: Conflict[];

  //あえて外に見せるkeyの型は、SessionIdにしている。
  //外からは、SessionIdで参照でき、内部的には確実なstringで参照できる。
  private readonly _sessions: Map<string, SessionEntity>; //TODO: これは、禁忌かもしれない。ID参照になおすべきかも。

  constructor(sessions: Iterable<SessionEntity>) {
    this._sessions = new Map(
      [...sessions].map((session) => [session.id.toString(), session])
    );

    this._conflicts = this.findConflicts(
      Array.from(this._sessions.values())
    );
  }

  get(key: SessionId): SessionEntity | undefined {
    return this._sessions.get(key.toString());
  }
  has(key: SessionId): boolean {
    return this._sessions.has(key.toString());
  }
  set(key: SessionId, value: SessionEntity): this {
    const newMap = new Map(this._sessions);
    newMap.set(key.toString(), value);

    //return new this.constructor(Array.from(newMap.values()));
    //ができないので、仕方なくそうしている。
    //TODO: 自分自身のクラスをnewする方法がほしいのだが・・・
    return new ThisClass(Array.from(newMap.values())) as this;
  }
  get size(): number {
    return this._sessions.size;
  }

  get [Symbol.toStringTag](): string {
    return "ConflictsWarningSessionList";
  }

  get sessions(): SessionEntity[] {
    return this.orderedSessionsByTimeRange; //互換性のために、ソートしておく。
  }

  get orderedSessionsByTimeRange(): SessionEntity[] {
    return Array.from(this._sessions.values()).sort((a, b) =>
      a.timeRange.compare(b.timeRange)
    );
  }

  private findConflicts(sessions: SessionEntity[]): Conflict[] {

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
