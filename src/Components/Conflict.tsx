import Session, {SessionId} from "./Session";
import TimeRange from "./TimeRange";


export default class Conflict{
  public readonly overlappingTimeRange: TimeRange;
  public readonly sessionIds: [SessionId, SessionId]; // 2番目の方が後の予定であるとする

  constructor(
    sessionA: Session,
    sessionB: Session,
  ){
    const overlappingTimeRange = sessionA.overlaps(sessionB);

    if(!overlappingTimeRange){
      throw new Error('No overlapping time range');
    }

    this.overlappingTimeRange = overlappingTimeRange;
    const sessionPair = [sessionA, sessionB].sort((a,b)=> a.openingTimeRange.compare(b.openingTimeRange));
    this.sessionIds = sessionPair.map((session)=> session.id) as [SessionId, SessionId];
  }

  //コンフリクトの酷さ
  get horribleness(): number{
    return this.overlappingTimeRange.durationHour;
  }

  toString(mode: StringMode | undefined = undefined): string{
    if(mode === 'horribleness-emoji'){
      switch(this.horribleness){
        case 0:
          return '🤨';
        case 1:
          return '😢';
        case 2:
          return '😡';
        default:
          return '😱';
      }
    }

    return `Conflict: ${this.overlappingTimeRange.toString()} #${this.sessionIds[0].toString('short')} <-> #${this.sessionIds[1].toString('short')}`;
  }
}

type StringMode = 'horribleness-emoji';