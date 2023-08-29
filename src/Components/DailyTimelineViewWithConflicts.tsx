import { FC, useState } from 'react';
import styled from 'styled-components';

import 'core-js/features/array';

import SessionEntitly, { SessionId, SessionView, SessionViewModel } from './Session'
import ViewModel from './ViewModel'
import ConflictsWarningSessionList from './ConflictsWarningSessionList';
import { TimeRangeView } from './TimeRange';
import Conflict from './Conflict';
import ZIndexCalcurator from '../Utils/ZIndexCalcurator';

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



const Component: FC<DailyTimelineWithConflictsViewModel> = ({
  className,
  main: {
    sessions, 
    conflicts
  },
  showsTime,

  onStartTimeBack,
  onStartTimeGo,

}: DailyTimelineWithConflictsViewModel)=>{
  //states
  const [topId, setTopId] = useState<string | undefined>(undefined);
  const [grabbedSessionBVM, setGrabbedSessionBVM] = useState<SessionBoxViewModel| undefined>(undefined);

  const sesBVMs = sessions.map((session)=> new SessionBoxViewModel(session, 0));

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];


  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  const zIndexCalcurator = new ZIndexCalcurator(
    sesBVMs.map(vm => vm.sessionId.toString()), 
    grabbedSessionBVM && grabbedSessionBVM.sessionId.toString() || topId
  );


  conflicts.forEach((conflict)=>{
    //かぶってるやつのうしろのやつ

    const baseSessionId = conflict.sessionIds[0];
    const baseSessionVM = sesBVMs.find((sesVM)=>sesVM.sessionId === baseSessionId);

    const slidingSessionId = conflict.sessionIds[1];
    const slidingSessionVM = sesBVMs.find((sesVM)=>sesVM.sessionId === slidingSessionId);

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
          sesBVMs.map((sesBVM, index)=>
            {
              //todo: 50がマジックナンバーになっている！！ DOM描画時に取得するようにする。
              const session = sesBVM.session;

              const x = sesBVM.leftPx;
              const y = session.timeRange.startHour * 50;

              const isGrabbed = grabbedSessionBVM ? sesBVM.sessionId.equals(grabbedSessionBVM.sessionId) : false; 

              return (
                <div className="e-session-box" 
                  style={{top: y +'px', left: x+'px', zIndex: zIndexCalcurator.getZIndex(sesBVM.sessionId.toString())}} 
                  key={session.id.toString()}
                  onClick={()=>{
                    if(grabbedSessionBVM && grabbedSessionBVM.sessionId.equals(sesBVM.sessionId)){
                      //すでに掴んでいたら放す
                    }
                    else{
                      setGrabbedSessionBVM(sesBVM)
                    }

                  }}
                  onMouseOver={()=>{
                    setTopId(sesBVM.sessionId.toString())
                  }}
                  onMouseOut={()=>{
                    setTopId(undefined)
                  }}
                >
                  {
                    isGrabbed && 
                      <div className="e-grabbed-status"
                        onClick={()=>{
                          setGrabbedSessionBVM(undefined);
                        }}
                      ></div>
                  }
                  <SessionView 
                    main={session}
                    onStartTimeBack={
                      ()=>onStartTimeBack(session.id)
                    }
                    onStartTimeGo={
                      ()=>onStartTimeGo(session.id)
                    }
                    isHovered={isGrabbed}
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
}


export const DailyTimelineWithConflictsView = styled(Component).withConfig({
  displayName: 'DailyTimelineWithConflictsView'
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


    >.e-grabbed-status{
      position: absolute;
        left:-0.8em;
        top:-0.8em;
        z-index: 1;
      width: 1em;
      height: 1em;

      &::before{
        content: '✊'
      }

      &:hover{
        &::before{
          content: '🖐'
        }

      }

    }
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
