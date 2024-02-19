import { FC, useContext, useState } from "react";
import styled from "styled-components";

import "core-js/features/array";

import SessionEntitly, { SessionAction, SessionId } from "./20_SessionEntity";
import ViewModel from "../00_Framework/00_ViewModel";
import Timeline from "./CalendarPackage/20_Timeline";
import { TimeRangeView, TimeDiff } from "./FuzzyTimePackage/index";

import Conflict from "./CalendarPackage/20_Conflict";
import ZIndexCalcurator from "../01_Utils/01_ZIndexCalcurator";
import SmartRect from "../00_Framework/Panel/01_SmartRect";
import WrapperSizeContext from "../00_Framework/Panel/01_WrapperSizeContext";
import { SessionView } from "./20_SessionView";
import scaleNumber from "../01_Utils/00_scaleNumber";

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
    return scaleNumber(
      horribleness,
      { start: 0, end: 3 },
      { start: 50, end: 0 }
    );
  }
}

//TODO: classなのはいいのだろうか？
interface DailyTimelineWithConflictsViewModel extends ViewModel<Timeline> {
  className?: string | undefined;

  readonly main: Timeline;
  readonly sessionEntities: Map<string, SessionEntitly>;
  readonly showsTime?: boolean | undefined;

  onTheSessionChange: (sessionId: SessionId, action: SessionAction) => void;

  onSessionFocus?: (sessionId: SessionId, originalRect: SmartRect) => void;
}

const createTimeRangeChangingAction = (hourDiff: number): SessionAction => {
  const timeRangeChangingAction: SessionAction = (session) => {
    const diffObj = new TimeDiff(hourDiff);
    const addingSession = session.changeTimeRange(diffObj);

    return addingSession;
  };

  return timeRangeChangingAction;
};

const Component: FC<DailyTimelineWithConflictsViewModel> = ({
  className,
  main: timeline,
  sessionEntities,
  showsTime,

  onTheSessionChange,
  onSessionFocus,
}: DailyTimelineWithConflictsViewModel) => {
  const { conflicts } = timeline;

  showsTime = showsTime || true;
  //states
  const [hoveredSessionId, setHoveredSessionId] = useState<
    SessionId | undefined
  >(undefined);
  const [grabbedSessionBVM, setGrabbedSessionBVM] = useState<
    SessionBoxViewModel | undefined
  >(undefined);

  //集約内のクラスから、他の集約のクラスを手繰り寄せる
  const timelineSessionEntities = timeline.sessions.map((tls) => {
    const a = sessionEntities.get(tls.id.toString());
    if (a === undefined) {
      throw new Error("timelineにあるsessionが、sessionEntitiesにない。");
    }

    return a;
  });

  const sesBVMs = new Map(
    timelineSessionEntities.map((session) => [
      session.id,
      new SessionBoxViewModel(session, 0),
    ])
  );

  const hoursMax = 24;
  const hoursArray = [...Array(hoursMax).keys()];

  const hourPx = 50;

  const [dragTargetAndStartY, setDragTargetAndStartY] = useState<
    { session: SessionEntitly; startY: number } | undefined
  >(undefined);
  const isDragging = dragTargetAndStartY !== undefined;

  const [hourDiff, setHourDiff] = useState<number>(0);

  //const sessionsBelongsToHour = distributeSessionsToHours(sessions);
  const leftUnitPx = 80;

  conflicts.forEach((conflict) => {
    //かぶってるやつのうしろのやつ

    const [prevSessionVM, nextSessionVM] = conflict.sessionIds.map((id) =>
      sesBVMs.get(id)
    );

    if (prevSessionVM === undefined || nextSessionVM === undefined) {
      // ありえないはず
      throw new Error(
        "コンフリクトがあるということは、その対象のセッションは必ず存在するはず。何かがおかしい。"
      );
    }

    nextSessionVM.leftPx = prevSessionVM.leftPx + leftUnitPx;
  });

  const zIndexCalcurator = new ZIndexCalcurator(
    Array.from(sesBVMs.values())
      .sort((a, b) => a.leftPx - b.leftPx)
      .map((vm) => vm.sessionId.toString()),
    grabbedSessionBVM?.sessionId.toString() || hoveredSessionId?.toString()
  );

  const handleDragEnd = (currentY: number) => {
    if (!isDragging) {
      return;
    }

    const oldY = dragTargetAndStartY.startY;

    const diff = currentY - oldY;
    const hourDiff = diff / hourPx;

    const timeRangeChangingAction = createTimeRangeChangingAction(hourDiff);

    onTheSessionChange(dragTargetAndStartY.session.id, timeRangeChangingAction);

    setDragTargetAndStartY(undefined);
    setHourDiff(0);
  };

  const wrapperSize = useContext(WrapperSizeContext);

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
        {[...sesBVMs.values()].map((sesBVM) => {
          const session = sesBVM.session;

          const x = sesBVM.leftPx;
          const y = session.timeRange.startHour * hourPx;

          const isGrabbed = grabbedSessionBVM
            ? sesBVM.sessionId.equals(grabbedSessionBVM.sessionId)
            : false;

          const onSessionChange = (action: SessionAction) =>
            onTheSessionChange(session.id, action);

          const zIndex = zIndexCalcurator.get(sesBVM.sessionId.toString());

          const layerScaleRatio = scaleNumber(
            x,
            { start: 0, end: 3 * leftUnitPx },
            { start: 1, end: 1 }
          );
          const shadowPx = scaleNumber(
            x,
            { start: 0, end: 3 * leftUnitPx },
            { start: 0, end: 3 }
          );

          const timelineSession = timeline.sessions.find((ts) =>
            ts.id.equals(session.id)
          );
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
                zIndex,
                transform: isGrabbed ? `scale(1)` : `scale(${layerScaleRatio})`,
                boxShadow: isGrabbed
                  ? "0 0 10px 5px hsla(47,100%,49%,0.57)"
                  : x > 0
                  ? `${shadowPx / 3}px ${
                      shadowPx / 3
                    }px ${shadowPx}px ${shadowPx}px rgba(0,0,0,0.5)`
                  : "none",
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
                setHoveredSessionId(sesBVM.sessionId);
              }}
              onMouseOut={() => {
                setHoveredSessionId(undefined);
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
                dispatchAction={onSessionChange}
                onDragStart={(startY: number) => {
                  setDragTargetAndStartY({ session, startY });
                }}
                onDoubleClick={(e) => {
                  const rect =
                    e.target instanceof HTMLElement &&
                    e.target.getBoundingClientRect();
                  if (!rect) {
                    throw new Error(
                      "rectが取得できなかった。要素がダブルクリックできてるのに要素がないってどゆこと！？"
                    );
                  }

                  const originalRect = new SmartRect(rect, wrapperSize);
                  console.log(originalRect.toJSON());

                  onSessionFocus && onSessionFocus(session.id, originalRect);
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
                hourPx={hourPx}
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
      transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out,
        left 0.2s ease-in-out;
      /*transform-origin: top left;*/

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
