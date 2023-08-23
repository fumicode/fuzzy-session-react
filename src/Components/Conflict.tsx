import Session, {SessionId} from "./Session";
import TimeRange from "./TimeRange";


export default class Conflict{
  public readonly overlappingTimeRange: TimeRange;
  public readonly sessionIds: [SessionId, SessionId];

  constructor(
    sessionA: Session,
    sessionB: Session,
  ){
    const overlappingTimeRange = sessionA.overlaps(sessionB);

    if(!overlappingTimeRange){
      throw new Error('No overlapping time range');
    }

    this.overlappingTimeRange = overlappingTimeRange;

    this.sessionIds = [
      sessionA.id,
      sessionB.id
    ];

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