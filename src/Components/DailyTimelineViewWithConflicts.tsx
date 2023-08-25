import { FC } from 'react';
import styled from 'styled-components';

import 'core-js/features/array';

import Session, { SessionId, SessionView } from './Session'
import ViewModel from './ViewModel'
import ConflictsWarningSessionList from './ConflictsWarningSessionList';
import { TimeRangeView } from './TimeRange';
import Conflict from './Conflict';

class SessionViewModel implements ViewModel<Session>{
  public readonly sessionId: SessionId;

  constructor(
    public readonly session: Session,
    public leftPx: number,
  ){
    this.sessionId = session.id;
  }

  get main(){
    return this.session;
  }
}


class ConflictViewModel implements ViewModel<Conflict>{
  constructor(
    public readonly main:Conflict,
    public leftPx: number
  ){ }

  get horriblenessHue():number{
    return this.calcHorriblenessHue(this.main.horribleness)
  }

  private calcHorriblenessHue(horribleness:number):number {
    const x = horribleness;

    const x1 = 0,
      y1 = 50,
      x2 = 3,
      y2 = 0;

    if(x > x2){ //とてもひどいなら真っ赤
      return y2;
    }
    else if(x < x1){ //ちょっとかさなってるだけなら真っ黄
      return y1;
    }

    const a = (y2 - y1)/(x2 - x1); //傾き
    return a * (x - x1) + y1
  }

}

class DailyTimelineWithConflictsViewModel implements ViewModel<ConflictsWarningSessionList>{
  className?: string | undefined;

  constructor(
    public readonly main: ConflictsWarningSessionList, 
    public readonly showsTime: boolean = true
  ){

    //TODO: コンフリクトがコンフリクトしてる場合には横にずらしたい。
    //const metaConflicts = this.main.conflicts;

  }


}

export const DailyTimelineWithConflictsView: FC<DailyTimelineWithConflictsViewModel> = styled((props: DailyTimelineWithConflictsViewModel)=>{
  const sessions = props.main.sessions;
  const sesVMs = sessions.map((session)=> new SessionViewModel(session, 0));
  const conflicts = props.main.conflicts;

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  console.log(conflicts);

  conflicts.forEach((conflict)=>{
    //かぶってるやつのうしろのやつ

    const baseSessionId = conflict.sessionIds[0];
    const baseSessionVM = sesVMs.find((sesVM)=>sesVM.sessionId === baseSessionId);

    const slidingSessionId = conflict.sessionIds[1];
    const slidingSessionVM = sesVMs.find((sesVM)=>sesVM.sessionId === slidingSessionId);

    if(baseSessionVM === undefined || slidingSessionVM === undefined){ // ありえないはず
      throw new Error('コンフリクトがあるということは、その対象のセッションは必ず存在するはず。何かがおかしい。');
    }

    slidingSessionVM.leftPx = baseSessionVM.leftPx +  20;
  });
  
  
  return (
    <div className={props.className}>
      {
        hoursArray.map((hour)=>
          <div className='e-hour-line' key={hour}>
            {
              props.showsTime && 
                <div className="e-hour-label">{hour}:00</div>
            }
            <div className="e-hour-content">
            </div>
          </div>
        )
      }
      <div className="e-contents">
        {
          sesVMs.map((sesVM)=>
            {
              //todo: 50がマジックナンバーになっている！！ DOM描画時に取得するようにする。
              const session = sesVM.session;

              const x = sesVM.leftPx;
              const y = session.openingTimeRange.startHour * 50;
              return (
                <div className="e-session-box" 
                  style={{top: y +'px', left: x+'px'}} 
                  key={session.id.toString()}
                >
                  <SessionView main={session}/>
                </div>
              )
            }
          )
        }
      </div>
      <div className="e-statuses">
        {
          conflicts.map((conflict)=>
            {
              const comflictVM = new ConflictViewModel(conflict, 0);

              const y = conflict.overlappingTimeRange.startHour * 50;
              const conflictId = conflict.sessionIds.join('-');

              return (
                <div className="e-status-box" style={{top: y +'px'}} key={conflictId}>
                  <TimeRangeView main={conflict.overlappingTimeRange} background={`hsla(${comflictVM.horriblenessHue}, 100%, 50%, 0.7)`}>
                    {conflict.toString('horribleness-emoji')}
                  </TimeRangeView>
                </div>
              )
            }
          )
        }
      </div>
    </div>
  );
})`
position: relative;
display: flex;
flex-direction: column;
width: 300px; //仮ぎめ

border-left: solid 1px #ccc;

>.e-hour-line{
  position: relative;

  height: 50px;
  &::before{
    position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
    display: block;
    content: ' ';
    border-top: 1px solid #ccc;
  }

  display: flex;

  >.e-hour-label{

    font-size: 10px;
    color: #333;

  }
  >.e-hour-content{
  }
}


>.e-contents{
  position: absolute;
    left: 60px;

  >.e-session-box{
    position: absolute;
    z-index: 1;
  }

}

>.e-statuses{
  position: absolute;
    left: 40px;

  >.e-status-box{
    position: absolute;
    z-index: 1;
    width: 20px;
  }

}
`;
