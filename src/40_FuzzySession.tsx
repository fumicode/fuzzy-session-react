import Timeline from "./FuzzySessionPackage/CalendarPackage/20_Timeline";
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
import { UserEntity, UserId } from "./FuzzySessionPackage/20_UserEntity";
import Entity, {
  StringId,
  convertIdentifiablesToMap,
} from "./00_Framework/00_Entity";
import { th } from "date-fns/locale";
import CalendarEntity from "./FuzzySessionPackage/CalendarPackage/20_CalendarEntity";

const incho = new UserEntity(
  "incho",
  {
    name: "院長",
  },
  undefined
);

const tainei = new UserEntity(
  "tainei",
  {
    name: "タイ姉",
  },
  undefined
);

const ashitaro = new UserEntity(
  "ashitaro ",
  {
    name: "アシ太郎",
  },
  undefined
);

const _users = [incho, tainei, ashitaro];

let inchoSessions: SessionEntity[] = [
  new SessionEntity(undefined, {
    title: "予定0",
    timeRange: new TimeRange("09:00", "11:00"),
    members: [incho, ashitaro],
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

const _allSessions = [...inchoSessions, ...taineiSessions, ...ashitaroSessions];

const updateCalendar = (
  users: Iterable<UserEntity>,
  sessions: Iterable<SessionEntity>
) => {
  const newCalendars = [...users].map((user) => {
    const userSessions = [...sessions].filter((s) =>
      s?.members?.has(user.id.toString())
    );
    return new CalendarEntity("cal_" + user.id.toString(), {
      title: user.name + "のカレンダー",
      timeline: new Timeline(userSessions),
    });
  });

  return newCalendars;
};

const _calendars: CalendarEntity[] = updateCalendar(_users, _allSessions);

interface GlobalState {
  readonly calendars: Map<string, CalendarEntity>;
  readonly users: Map<string, UserEntity>;
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

    const [globalState, setGlobalState] = useState<GlobalState>({
      calendars: convertIdentifiablesToMap(_calendars),
      users: convertIdentifiablesToMap(_users),
      sessions: convertIdentifiablesToMap(_allSessions),
    });

    const onSessionSave = () => {
      //カレンダーも更新。（全部イチから作り直す）
      setGlobalState((gs) =>
        update(gs, {
          calendars: {
            $set: convertIdentifiablesToMap(
              updateCalendar([...gs.users.values()], [...gs.sessions.values()])
            ),
          },
        })
      );
    };

    const goIntoFutureSession = (
      sId: SessionId,
      sessionAction: SessionAction
    ) => {
      try {
        //検索
        const session = globalState.sessions.get(sId.toString());
        if (session === undefined) {
          throw new Error("そんなことはありえないはず");
        }

        //更新
        const futureSession = sessionAction(session);

        //永続化
        setGlobalState((globalState) =>
          update(globalState, {
            sessions: {
              $add: [[session.id.toString(), futureSession]],
            },
          })
        );

        onSessionSave();

        //このあと、関連イベントが発火などすべき。
        //TODO: 実装。
      } catch (e) {
        console.log(e);
      }
    };

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
                  <p></p>
                  <p>参加者：</p>
                  <ul>
                    {selectedSession.members &&
                      [...selectedSession.members].map((memberId) => (
                        <li>{globalState.users.get(memberId)?.name}</li>
                      ))}
                  </ul>
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
            position={{ x: 100, y: 200 }}
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
                  {[...globalState.calendars.values()].map((cal, calIndex) => {
                    const sessionEntities = cal.timeline.sessions.map(
                      (tls) =>
                        globalState.sessions.get(
                          tls.id.toString()
                        ) as SessionEntity
                    );
                    //const sessionEntities = [...globalState.sessions.values()];

                    return (
                      <div className="e-column" key={calIndex}>
                        <h2>{cal.title}</h2>
                        <DailyTimelineWithConflictsView
                          main={cal.timeline}
                          sessionEntities={sessionEntities}
                          showsTime={calIndex === 0}
                          onTheSessionChange={goIntoFutureSession}
                          onSessionFocus={(sId, originalRect) => {
                            const session = globalState.sessions.get(
                              sId.toString()
                            );
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
