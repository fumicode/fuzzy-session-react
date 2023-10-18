import Timeline from "./FuzzySessionPackage/20_Timeline";
import SessionEntity, {
  SessionAction,
  SessionId,
} from "./FuzzySessionPackage/20_SessionEntity";
import { TimeRange } from "./FuzzySessionPackage/FuzzyTimePackage/index";
import { FC, useState } from "react";

import update from "immutability-helper";
import { ThreeRows } from "./GaiaCodePackage/20_GaiaCode";
import { DailyTimelineWithConflictsView } from "./FuzzySessionPackage/30_DailyTimelineViewWithConflicts";

import ViewModel from "./00_Framework/00_ViewModel";
import { Point2, Size2 } from "./01_Utils/00_Point";
import Panel from "./00_Framework/Panel/02_Panel";
import ZIndexCalcurator from "./01_Utils/01_ZIndexCalcurator";
import Layer, { inversePropotionFunction } from "./00_Framework/Panel/02_Layer";
import styled from "styled-components";
import { SessionView } from "./FuzzySessionPackage/20_SessionView";
import { User, UserId } from "./FuzzySessionPackage/20_UserEntity";

const incho = new User(
  "incho",
  {
    name: "院長",
  },
  undefined
);

const tainei = new User(
  "tainei",
  {
    name: "タイ姉",
  },
  undefined
);

const ashitaro = new User(
  "ashitaro ",
  {
    name: "アシ太郎",
  },
  undefined
);

const users = [incho, tainei, ashitaro];

let inchoSessions: SessionEntity[] = [
  new SessionEntity(undefined, {
    title: "予定0",
    timeRange: new TimeRange("09:00", "11:00"),
    members: [incho],
  }),

  new SessionEntity(undefined, {
    title: "予定1",
    timeRange: new TimeRange("10:00", "12:00"),
    members: [incho],
  }),

  new SessionEntity(undefined, {
    title: "予定2",
    timeRange: new TimeRange("11:00", "14:00"),
    members: [incho],
  }),

  new SessionEntity(undefined, {
    title: "予定3",
    timeRange: new TimeRange("15:00", "17:00"),
    members: [incho],
  }),

  new SessionEntity(undefined, {
    title: "予定4",
    timeRange: new TimeRange("17:00", "18:00"),
    members: [incho],
  }),

  new SessionEntity(undefined, {
    title: "予定4",
    timeRange: new TimeRange("18:00", "20:00"),
    members: [incho],
  }),
];

const taineiSessions: SessionEntity[] = [
  new SessionEntity(undefined, {
    title: "勤務時間",
    timeRange: new TimeRange("08:00", "18:00"),
    members: [tainei],
  }),

  new SessionEntity(undefined, {
    title: "タイ古式3時間",
    timeRange: new TimeRange("09:00", "12:00"),
    members: [tainei],
  }),

  new SessionEntity(undefined, {
    title: "タイ古式1時間",
    timeRange: new TimeRange("13:00", "14:00"),
    members: [tainei],
  }),

  new SessionEntity(undefined, {
    title: "タイ古式1時間",
    timeRange: new TimeRange("16:40", "17:00"),
    members: [tainei],
  }),
];

const ashitaroSessions: SessionEntity[] = [
  new SessionEntity(undefined, {
    title: "院長アシスタント0",
    timeRange: new TimeRange("09:00", "10:00"),
    members: [ashitaro],
  }),

  new SessionEntity(undefined, {
    title: "院長アシスタント1",
    timeRange: new TimeRange("10:00", "12:00"),
    members: [ashitaro],
  }),

  new SessionEntity(undefined, {
    title: "院長アシスタント2",
    timeRange: new TimeRange("12:00", "14:00"),
    members: [ashitaro],
  }),

  new SessionEntity(undefined, {
    title: "院長アシスタント3",
    timeRange: new TimeRange("15:00", "17:00"),
    members: [ashitaro],
  }),

  new SessionEntity(undefined, {
    title: "院長アシスタント4",
    timeRange: new TimeRange("18:00", "20:00"),
    members: [ashitaro],
  }),
];

const allSessions = [...inchoSessions, ...taineiSessions, ...ashitaroSessions];

interface Calendar {
  title: string;
  sessionMap: Timeline;
}

const _calendars: Calendar[] = [
  {
    title: "院長",
    sessionMap: new Timeline(inchoSessions),
  },
  {
    title: "タイ姉",
    sessionMap: new Timeline(taineiSessions),
  },
  {
    title: "アシ太郎",
    sessionMap: new Timeline(ashitaroSessions),
  },
];

interface GlobalState {
  readonly calendars: Map<string, Calendar>;
  readonly users: Map<string, User>;
  readonly sessions: Map<string, SessionEntity>;
}

interface FuzzySessionViewModel extends ViewModel<{}> {
  onPanelClick(): void;
}

const FuzzySession: FC<FuzzySessionViewModel> = styled(
  (props: FuzzySessionViewModel) => {
    const {
      className,
      // position,
      // size,
      // parentSize,
      // children,
      // transitionState,
      // zIndex,
      // onMove,
      // debugMode,

      onPanelClick,
    } = props;
    const [calendars, setCalendars] = useState<Calendar[]>(_calendars);

    const goIntoFutureCalendar = (
      calIndex: number,
      sId: SessionId,
      sessionAction: SessionAction
    ) => {
      //要するに何をしたいかと言うと：
      //sessionsの中のinchoSessionsのsIdがsessionのやつをchangeStartTimeする。

      //検索
      const session = calendars[calIndex].sessionMap.get(sId);
      if (session === undefined) {
        throw new Error("そんなことはありえないはず");
      }

      try {
        const futureSession = sessionAction(session);

        //永続化
        const newCals = update(calendars, {
          [calIndex]: {
            sessionMap: (list) => list.set(futureSession.id, futureSession),
          },
        });
        setCalendars(newCals);
      } catch (e) {
        console.log(e);
      }
    };

    const firstSession = calendars[0].sessionMap.get(inchoSessions[0].id);
    if (firstSession === undefined) {
      throw new Error("カレンダーからsessionが取得できませんでした。");
    }

    const [viewZ, setViewZ] = useState<ZIndexCalcurator>(
      new ZIndexCalcurator(["詳細", "一覧"])
    );

    const [selectedSession, setSelectedSession] = useState<
      SessionEntity | undefined
    >(undefined);

    const [selectedPosition, setSelectedPosition] = useState<Point2>({
      x: 0,
      y: 0,
    });

    return (
      <>
        {selectedSession && (
          <Layer
            zIndex={viewZ.get("詳細")}
            colorHue={0}
            name={"詳細"}
            zScaler={inversePropotionFunction(8)}
            zIndexMax={1}
            onLayerHeaderClick={() => {
              setViewZ(viewZ.moveToTop("詳細"));
              onPanelClick();
            }}
          >
            <Panel
              position={selectedPosition}
              size={{ width: 200, height: 200 }}
              zIndex={0}
              isActive={true}
              onMove={() => {}}
              bgColor="white"
              onPanelClick={() => {
                setViewZ(viewZ.moveToTop("詳細"));
                onPanelClick();
              }}
            >
              {(renderedRect) => (
                <div>
                  <SessionView
                    main={selectedSession}
                    hourPx={20}
                    onStartTimeChange={() => {}}
                    onEndTimeChange={() => {}}
                    onDragStart={() => {}}
                    isHovered={true}
                  />
                </div>
              )}
            </Panel>
          </Layer>
        )}
        <Layer
          zIndex={viewZ.get("一覧")}
          colorHue={0}
          name={"一覧"}
          zScaler={inversePropotionFunction(8)}
          zIndexMax={1}
          onLayerHeaderClick={() => {
            setViewZ(viewZ.moveToTop("一覧"));
            onPanelClick();
          }}
        >
          <Panel
            position={{ x: 600, y: 200 }}
            size={{ width: 900, height: 700 }}
            zIndex={0}
            isActive={true}
            onMove={() => {}}
            bgColor="white"
            onPanelClick={() => {
              setViewZ(viewZ.moveToTop("一覧"));
              onPanelClick();
            }}
          >
            {(renderedRect) => (
              <div className={className}>
                <h1>🤖チャピスケ！📆　　（FuzzySession）</h1>
                <div className="e-calendar-columns">
                  {calendars.map((cal, calIndex) => {
                    const goIntoFutureSession = (
                      sId: SessionId,
                      action: SessionAction
                    ) => goIntoFutureCalendar(calIndex, sId, action);
                    return (
                      <div className="e-column" key={calIndex}>
                        <h2>{cal.title}</h2>
                        <DailyTimelineWithConflictsView
                          main={cal.sessionMap}
                          showsTime={calIndex === 0}
                          onTheSessionChange={goIntoFutureSession}
                          onSessionFocus={(sId, originalRect) => {
                            const session = cal.sessionMap.get(sId);
                            if (session === undefined) {
                              return;
                            }

                            const positionToOpen =
                              originalRect.calcPositionToOpen({
                                width: 200,
                                height: 200,
                              });
                            setSelectedSession(session);
                            setSelectedPosition(positionToOpen);
                            setViewZ(viewZ.moveToTop("詳細"));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Panel>
        </Layer>
      </>
    );
  }
)`
  .e-calendar-columns {
    display: flex;
    flex-direction: row;

    > .e-column {
    }
  }
`;

export default FuzzySession;
