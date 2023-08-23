import Session from "./Session";

import Conflict from "./Conflict";

export default class ConflictsWarningSessionList{
  private readonly _conflicts: Conflict[];
  private readonly _sessions: Session[]

  constructor(
    sessions: Session[]
  ){
    this._conflicts = this.findConflicts(sessions);
    this._sessions  = sessions;
  }

  get sessions(): Session[]{
    return this._sessions;
  }

  private findConflicts(sessions: Session[]): Conflict[]{
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
