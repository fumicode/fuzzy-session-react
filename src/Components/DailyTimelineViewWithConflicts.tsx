import { FC, useState } from 'react';
import styled from 'styled-components';

import 'core-js/features/array';

import SessionEntitly, { SessionId, SessionView } from './Session'
import ViewModel from './ViewModel'
import ConflictsWarningSessionList from './ConflictsWarningSessionList';
import { TimeRangeView } from './TimeRange';
import Conflict from './Conflict';

class SessionBoxViewModel implements ViewModel<SessionEntitly>{
  public readonly sessionId: SessionId;

  constructor(
    public readonly session: SessionEntitly,
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
    public readonly showsTime: boolean = true,

    public onStartTimeBack: (sessionId: SessionId) => void,
    public onStartTimeGo: (sessionId: SessionId) => void
  ){

    //TODO: コンフリクトがコンフリクトしてる場合には横にずらしたい。
    //const metaConflicts = this.main.conflicts;

  }


}


class ZIndexCalcurator{

  constructor(
    //文字列じゃなくて、抽象化したい。 equalsでもできるようにしたい。
    readonly ids: string[],
    readonly topId: string | undefined = undefined,
    //readonly bottomId: string | undefined //あとで:
  ){
    //後ほど上が普通
  }

  setTop(id:string | undefined){
    if(id === undefined){
      return new ZIndexCalcurator(this.ids, undefined);
    }

    if(!this.ids.includes(id)){
      throw new Error(`#${id}はid一覧に含まれていないため、トップに設定できません`);
    }

    return new ZIndexCalcurator(this.ids, id);
  }

  getZIndex(id: string){
    if(id === this.topId){
      return this.maxZIndex + 1; 
    }

    return this.ids.indexOf(id);
  }

  get maxZIndex(){
    return this.ids.length;
  }

}

export const DailyTimelineWithConflictsView: FC<DailyTimelineWithConflictsViewModel> = styled(({
  className,
  main: {
    sessions, 
    conflicts
  },
  showsTime,

  onStartTimeBack,
  onStartTimeGo,

}: DailyTimelineWithConflictsViewModel)=>{
  const sesVMs = sessions.map((session)=> new SessionBoxViewModel(session, 0));

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];


  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  console.log(conflicts);

  const [topId, setTopId] = useState<string | undefined>(undefined);
  const zIndexCalcurator = new ZIndexCalcurator(
    sesVMs.map(vm => vm.sessionId.toString()), 
    topId
  );

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
    <div className={className}>
      {
        hoursArray.map((hour)=>
          <div className='e-hour-line' key={hour}>
            {
              showsTime && 
                <div className="e-hour-label">{hour}:00</div>
            }
            <div className="e-hour-content">
            </div>
          </div>
        )
      }
      <div className="e-contents">
        {
          sesVMs.map((sesVM, index)=>
            {
              //todo: 50がマジックナンバーになっている！！ DOM描画時に取得するようにする。
              const session = sesVM.session;

              const x = sesVM.leftPx;
              const y = session.timeRange.startHour * 50;
              return (
                <div className="e-session-box" 
                  style={{top: y +'px', left: x+'px', zIndex: zIndexCalcurator.getZIndex(sesVM.sessionId.toString())}} 
                  key={session.id.toString()}
                  onMouseOver={()=>{
                    setTopId(sesVM.sessionId.toString())
                  }}
                  onMouseOut={()=>{
                    setTopId(undefined)
                  }}
                >
                  <SessionView 
                    main={session}
                    onStartTimeBack={
                      ()=>onStartTimeBack(session.id)
                    }
                    onStartTimeGo={
                      ()=>onStartTimeGo(session.id)
                    }
                  />
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
