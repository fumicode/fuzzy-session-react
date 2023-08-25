import SessionEntity from "./Session";

import Conflict from "./Conflict";

export default class ConflictsWarningSessionList{
  private readonly _conflicts: Conflict[];
  private readonly _sessions: SessionEntity[]; //TODO: これは、禁忌かもしれない。ID参照になおすべきかも。

  constructor(
    sessions: SessionEntity[]
  ){
    sessions = [...sessions].sort((a, b) => 
      a.openingTimeRange.compare(b.openingTimeRange));
    this._conflicts = this.findConflicts(sessions);
    this._sessions  = sessions;
  }

  get sessions(): SessionEntity[]{
    return this._sessions;
  }

  private findConflicts(sessions: SessionEntity[]): Conflict[]{
    let conflicts: Conflict[] = [];
    for(let i = 0; i < sessions.length; i++){
      for(let j = i + 1; j < sessions.length; j++){
        if(sessions[i].overlaps(sessions[j])){
          conflicts.push(new Conflict(sessions[i], sessions[j]));
        }
      }
    }
    return conflicts;
  }

  get conflicts(): Conflict[]{
    return this._conflicts;
  }
}
