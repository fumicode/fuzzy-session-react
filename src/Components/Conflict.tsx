import Session, {SessionId} from "./Session";
import TimeRange from "./TimeRange";


export default class Conflict{
  public readonly overlappingTimeRange: TimeRange;
  public readonly conflictingSessionIds: [SessionId, SessionId];

  constructor(
    sessionA: Session,
    sessionB: Session,
  ){
    const overlappingTimeRange = sessionA.overlaps(sessionB);

    if(!overlappingTimeRange){
      throw new Error('No overlapping time range');
    }

    this.overlappingTimeRange = overlappingTimeRange;

    this.conflictingSessionIds = [
      sessionA.id,
      sessionB.id
    ];

  }

  toString(): string{
    return `Conflict: ${this.overlappingTimeRange.toString()} #${this.conflictingSessionIds[0].toString('short')} <-> #${this.conflictingSessionIds[1].toString('short')}`;
  }

}