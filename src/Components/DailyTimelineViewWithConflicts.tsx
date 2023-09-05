import { FC, useState } from "react";
import styled from "styled-components";

import "core-js/features/array";

import SessionEntitly, { SessionId, SessionView } from "./Session";
import ViewModel from "./ViewModel";
import ConflictsWarningSessionMap from "./ConflictsWarningSessionList";
import { TimeRangeView } from "./TimeRange";
import Conflict from "./Conflict";
import ZIndexCalcurator from "../Utils/ZIndexCalcurator";

class SessionBoxViewModel implements ViewModel<SessionEntitly> {
  public readonly sessionId: SessionId;

  constructor(public readonly session: SessionEntitly, public leftPx: number) {
    this.sessionId = session.id;
  }

  get main() {
    return this.session;
  }
}

class ConflictViewModel implements ViewModel<Conflict> {
  constructor(public readonly main: Conflict, public leftPx: number) {}

  get horriblenessHue(): number {
    return this.calcHorriblenessHue(this.main.horribleness);
  }

  private calcHorriblenessHue(horribleness: number): number {
    const x = horribleness;

    const x1 = 0,
      y1 = 50,
      x2 = 3,
      y2 = 0;

    if (x > x2) {
      //とてもひどいなら真っ赤
      return y2;
    } else if (x < x1) {
      //ちょっとかさなってるだけなら真っ黄
      return y1;
    }

    const a = (y2 - y1) / (x2 - x1); //傾き
    return a * (x - x1) + y1;
  }
}

class DailyTimelineWithConflictsViewModel
  implements ViewModel<ConflictsWarningSessionMap>
{
  className?: string | undefined;

  constructor(
    public readonly main: ConflictsWarningSessionMap,
    public readonly showsTime: boolean = true,

    public onStartTimeBack: (sessionId: SessionId) => void,
    public onStartTimeGo: (sessionId: SessionId) => void,

    public onEndTimeBack: (sessionId: SessionId) => void,
    public onEndTimeGo: (sessionId: SessionId) => void,

    public onTimeRangeChange: (sessionId: SessionId, hourDiff: number) => void
  ) {
    //TODO: コンフリクトがコンフリクトしてる場合には横にずらしたい。
    //const metaConflicts = this.main.conflicts;
  }
}

const Component: FC<DailyTimelineWithConflictsViewModel> = ({
  className,
  main: { sessions, conflicts },
  showsTime,

  onStartTimeBack,
  onStartTimeGo,

  onEndTimeBack,
  onEndTimeGo,

  onTimeRangeChange,
}: DailyTimelineWithConflictsViewModel) => {
  //states
  const [topId, setTopId] = useState<string | undefined>(undefined);
  const [grabbedSessionBVM, setGrabbedSessionBVM] = useState<
    SessionBoxViewModel | undefined
  >(undefined);

  const sesBVMs = sessions.map(
    (session) => new SessionBoxViewModel(session, 0)
  );

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  const hourPx = 30;

  const [dragTargetAndStartY, setDragTargetAndStartY] = useState<
    { session: SessionEntitly; startY: number } | undefined
  >(undefined);
  const isDragging = dragTargetAndStartY !== undefined;

  const [hourDiff, setHourDiff] = useState<number>(0);

  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);

  const zIndexCalcurator = new ZIndexCalcurator(
    sesBVMs.map((vm) => vm.sessionId.toString()),
    (grabbedSessionBVM && grabbedSessionBVM.sessionId.toString()) || topId
  );

  conflicts.forEach((conflict) => {
    //かぶってるやつのうしろのやつ

    const baseSessionId = conflict.sessionIds[0];
    const baseSessionVM = sesBVMs.find(
      (sesVM) => sesVM.sessionId === baseSessionId
    );

    const slidingSessionId = conflict.sessionIds[1];
    const slidingSessionVM = sesBVMs.find(
      (sesVM) => sesVM.sessionId === slidingSessionId
    );

    if (baseSessionVM === undefined || slidingSessionVM === undefined) {
      // ありえないはず
      throw new Error(
        "コンフリクトがあるということは、その対象のセッションは必ず存在するはず。何かがおかしい。"
      );
    }

    slidingSessionVM.leftPx = baseSessionVM.leftPx + 20;
  });

  const handleDragEnd = (currentY: number) => {
    if (!isDragging) {
      return;
    }

    const oldY = dragTargetAndStartY.startY;

    const diff = currentY - oldY;
    const hourDiff = diff / hourPx;

    onTimeRangeChange(dragTargetAndStartY.session.id, hourDiff);

    setDragTargetAndStartY(undefined);
    setHourDiff(0);
  };

  return (
    <div
      className={className}
      onMouseMove={(e) => {
        if (!isDragging) {
          return;
        }
        //ドラッグ中なら

        const oldY = dragTargetAndStartY.startY;
        const currentY = e.clientY;

        const diff = currentY - oldY;
        const hd = diff / hourPx;

        setHourDiff(hd);
      }}
      onMouseUp={(e) => {
        handleDragEnd(e.clientY);
      }}
      onMouseLeave={(e) => {
        handleDragEnd(e.clientY);
      }}
    >
      <div className="e-status-panel">
        {(grabbedSessionBVM && "✊" + grabbedSessionBVM.session.title) || "🖐"}
        <br />
        {dragTargetAndStartY?.session
          ? "👆" + dragTargetAndStartY.session.title
          : ""}
      </div>
      {hoursArray.map((hour) => (
        <div className="e-hour-line" key={hour} style={{ height: hourPx }}>
          {showsTime && <div className="e-hour-label">{hour}:00</div>}
          <div className="e-hour-content"></div>
        </div>
      ))}
      <div className="e-contents">
        {sesBVMs.map((sesBVM, index) => {
          const session = sesBVM.session;

          const x = sesBVM.leftPx;
          const y = session.timeRange.startHour * hourPx;

          const isGrabbed = grabbedSessionBVM
            ? sesBVM.sessionId.equals(grabbedSessionBVM.sessionId)
            : false;

          return (
            <div
              className="e-session-box"
              style={{
                top:
                  (dragTargetAndStartY?.session === session
                    ? hourDiff * hourPx
                    : 0) +
                  y +
                  "px",
                left: x + "px",
                zIndex: zIndexCalcurator.getZIndex(sesBVM.sessionId.toString()),
              }}
              key={session.id.toString()}
              onClick={() => {
                if (
                  grabbedSessionBVM &&
                  grabbedSessionBVM.sessionId.equals(sesBVM.sessionId)
                ) {
                  //すでに掴んでいたら放す
                } else {
                  setGrabbedSessionBVM(sesBVM);
                }
              }}
              onMouseOver={() => {
                setTopId(sesBVM.sessionId.toString());
              }}
              onMouseOut={() => {
                setTopId(undefined);
              }}
            >
              {isGrabbed && (
                <div
                  className="e-grabbed-status"
                  onClick={() => {
                    setGrabbedSessionBVM(undefined);
                  }}
                ></div>
              )}
              <SessionView
                main={session}
                hourPx={hourPx}
                onStartTimeBack={() => onStartTimeBack(session.id)}
                onStartTimeGo={() => onStartTimeGo(session.id)}
                onEndTimeBack={() => onEndTimeBack(session.id)}
                onEndTimeGo={() => onEndTimeGo(session.id)}
                onDragStart={(startY: number) => {
                  setDragTargetAndStartY({ session, startY });
                }}
                onDragEnd={(hourDiff) => {
                  onTimeRangeChange(session.id, hourDiff);
                }}
                isHovered={isGrabbed}
              />
            </div>
          );
        })}
      </div>
      <div className="e-statuses">
        {conflicts.map((conflict) => {
          const comflictVM = new ConflictViewModel(conflict, 0);

          const y = conflict.overlappingTimeRange.startHour * hourPx;
          const conflictId = conflict.sessionIds.join("-");

          return (
            <div
              className="e-status-box"
              style={{ top: y + "px" }}
              key={conflictId}
            >
              <TimeRangeView
                main={conflict.overlappingTimeRange}
                background={`hsla(${comflictVM.horriblenessHue}, 100%, 50%, 0.7)`}
              >
                {conflict.toString("horribleness-emoji")}
              </TimeRangeView>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DailyTimelineWithConflictsView = styled(Component).withConfig({
  displayName: "DailyTimelineWithConflictsView",
})`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px; //仮ぎめ

  border-left: solid 1px #ccc;

  > .e-status-panel {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    background: white;
    font-size: 10px;
    color: black;
    padding: 3px;
    border-radius: 3px;
    border: solid 1px black;
  }

  > .e-hour-line {
    position: relative;

    height: 30px;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      display: block;
      content: " ";
      border-top: 1px solid #ccc;
    }

    display: flex;

    > .e-hour-label {
      font-size: 10px;
      color: #333;
    }
    > .e-hour-content {
    }
  }

  > .e-contents {
    position: absolute;
    left: 60px;

    > .e-session-box {
      position: absolute;
      z-index: 1;

      > .e-grabbed-status {
        position: absolute;
        left: -0.8em;
        top: -0.8em;
        z-index: 1;
        width: 1em;
        height: 1em;

        &::before {
          content: "✊";
        }

        &:hover {
          &::before {
            content: "🖐";
          }
        }
      }
    }
  }

  > .e-statuses {
    position: absolute;
    left: 40px;

    > .e-status-box {
      position: absolute;
      z-index: 1;
      width: 20px;
    }
  }
`;
